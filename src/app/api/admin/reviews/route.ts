import { NextResponse } from "next/server";

import { readDataArray } from "@/lib/server/dataStore";

export const runtime = "nodejs";

type ReviewItem = {
  id: string;
  productName?: string;
  productKey?: string;
  authorName?: string;
  authorEmail?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const keyword = String(url.searchParams.get("q") ?? "").trim().toLowerCase();
    let reviews = await readDataArray<ReviewItem>("reviews");

    reviews = [...reviews].sort((left, right) =>
      String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? "")),
    );

    if (keyword) {
      reviews = reviews.filter((review) =>
        [
          review.productName,
          review.productKey,
          review.authorName,
          review.authorEmail,
          review.comment,
        ].some((value) => String(value ?? "").toLowerCase().includes(keyword)),
      );
    }

    return NextResponse.json({ items: reviews });
  } catch {
    return NextResponse.json(
      { error: "Không thể tải danh sách đánh giá." },
      { status: 500 },
    );
  }
}
