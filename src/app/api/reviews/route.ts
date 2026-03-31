import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

type StoredReview = {
  id: string;
  productKey: string;
  productName: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const REVIEWS_FILE_PATH = path.join(process.cwd(), "src", "data", "reviews.json");

async function readReviews() {
  try {
    const raw = await fs.readFile(REVIEWS_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as StoredReview[]) : [];
  } catch {
    return [];
  }
}

async function writeReviews(reviews: StoredReview[]) {
  await fs.writeFile(REVIEWS_FILE_PATH, `${JSON.stringify(reviews, null, 2)}\n`, "utf8");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const productKey = url.searchParams.get("productKey")?.trim() ?? "";
    const reviews = await readReviews();

    const filteredReviews = productKey
      ? reviews.filter((review) => review.productKey === productKey)
      : reviews;

    const sortedReviews = [...filteredReviews].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );

    const totalReviews = sortedReviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              sortedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            ).toFixed(1),
          )
        : 0;

    return NextResponse.json({
      reviews: sortedReviews,
      totalReviews,
      averageRating,
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể tải đánh giá lúc này." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productKey = String(body?.productKey ?? "").trim();
    const productName = String(body?.productName ?? "").trim();
    const authorName = String(body?.authorName ?? "").trim();
    const authorEmail = String(body?.authorEmail ?? "").trim().toLowerCase();
    const comment = String(body?.comment ?? "").trim();
    const rating = Number(body?.rating ?? 0);

    if (!productKey || !productName || !authorName || !comment) {
      return NextResponse.json(
        { error: "Vui lòng nhập đủ tên người đánh giá và nội dung đánh giá." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Số sao đánh giá phải từ 1 đến 5." },
        { status: 400 },
      );
    }

    const reviews = await readReviews();
    const nextReview: StoredReview = {
      id: randomUUID(),
      productKey,
      productName,
      authorName,
      authorEmail,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    reviews.push(nextReview);
    await writeReviews(reviews);

    return NextResponse.json({
      success: true,
      review: nextReview,
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể lưu đánh giá lúc này." },
      { status: 500 },
    );
  }
}
