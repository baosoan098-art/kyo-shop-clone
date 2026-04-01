import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { COLLECTIONS, getCollection } from "@/lib/server/mongoCollections";

export async function GET() {
  try {
    const products = await (await getCollection(COLLECTIONS.products))
      .find({})
      .toArray();
    const lipsticks = await (await getCollection(COLLECTIONS.lipsticks))
      .find({})
      .toArray();
    const perfumes = await (await getCollection(COLLECTIONS.perfumes))
      .find({})
      .toArray();

    return NextResponse.json({ products, lipsticks, perfumes });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không tải được sản phẩm.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const resource = String(body.resource ?? "products");

    if (
      !["products", "lipsticks", "perfumes"].includes(resource)
    ) {
      return NextResponse.json(
        { message: "Nguồn dữ liệu không hợp lệ." },
        { status: 400 },
      );
    }

    const collection = await getCollection(
      COLLECTIONS[resource as "products" | "lipsticks" | "perfumes"],
    );

    const item = {
      ...body,
      id: body.id ?? crypto.randomUUID(),
    };

    await collection.insertOne(item);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thêm được sản phẩm.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
