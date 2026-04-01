import { NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/server/mongoCollections";

type RouteParams = Promise<{ resource: string; id: string }>;

const RESOURCE_KEYS = ["products", "lipsticks", "perfumes"] as const;

function resolveCollection(resource: string) {
  if (!RESOURCE_KEYS.includes(resource as typeof RESOURCE_KEYS[number])) {
    throw new Error("Nguồn dữ liệu không hợp lệ.");
  }

  return COLLECTIONS[resource as "products" | "lipsticks" | "perfumes"];
}

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { resource, id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const collection = await getCollection(resolveCollection(resource));

    const result = await collection.findOneAndUpdate(
      { id: String(id) },
      { $set: payload },
      { returnDocument: "after" },
    );

    if (!result.value) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, item: result.value });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không cập nhật được sản phẩm.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { resource, id } = await params;
    const collection = await getCollection(resolveCollection(resource));
    const result = await collection.deleteOne({ id: String(id) });

    if (!result.deletedCount) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không xóa được sản phẩm.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
