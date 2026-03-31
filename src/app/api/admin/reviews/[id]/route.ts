import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type RouteParams = Promise<{ id: string }>;

const filePath = path.join(process.cwd(), "src", "data", "reviews.json");

async function readReviews() {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const reviews = await readReviews();
    const index = reviews.findIndex(
      (item: Record<string, unknown>) => String(item.id) === String(id),
    );

    if (index < 0) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 },
      );
    }

    const nextReview = {
      ...reviews[index],
      ...payload,
      id: reviews[index].id,
    };

    reviews[index] = nextReview;
    await fs.writeFile(filePath, JSON.stringify(reviews, null, 2), "utf8");

    return NextResponse.json({ ok: true, review: nextReview });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không cập nhật được đánh giá.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = await params;
    const reviews = await readReviews();
    const nextReviews = reviews.filter(
      (item: Record<string, unknown>) => String(item.id) !== String(id),
    );

    if (nextReviews.length === reviews.length) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 },
      );
    }

    await fs.writeFile(filePath, JSON.stringify(nextReviews, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không xóa được đánh giá.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
