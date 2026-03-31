import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type RouteParams = Promise<{ resource: string; id: string }>;

const RESOURCE_TO_FILE = {
  products: "products.json",
  lipsticks: "lipsticks.json",
  perfumes: "perfumes.json",
} as const;

function getDataFile(resource: string) {
  const fileName =
    RESOURCE_TO_FILE[resource as keyof typeof RESOURCE_TO_FILE] ?? null;

  if (!fileName) {
    throw new Error("Nguồn dữ liệu không hợp lệ.");
  }

  return path.join(process.cwd(), "src", "data", fileName);
}

async function readCollection(resource: string) {
  const filePath = getDataFile(resource);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);

  return {
    filePath,
    items: Array.isArray(parsed) ? parsed : [],
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { resource, id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const { filePath, items } = await readCollection(resource);
    const index = items.findIndex(
      (item: Record<string, unknown>) => String(item.id) === String(id),
    );

    if (index < 0) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm." },
        { status: 404 },
      );
    }

    const nextItem = {
      ...items[index],
      ...payload,
      id: items[index].id,
    };

    items[index] = nextItem;
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");

    return NextResponse.json({ ok: true, item: nextItem });
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
    const { filePath, items } = await readCollection(resource);
    const nextItems = items.filter(
      (item: Record<string, unknown>) => String(item.id) !== String(id),
    );

    if (nextItems.length === items.length) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm." },
        { status: 404 },
      );
    }

    await fs.writeFile(filePath, JSON.stringify(nextItems, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không xóa được sản phẩm.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
