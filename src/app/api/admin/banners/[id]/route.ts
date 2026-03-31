import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type RouteParams = Promise<{ id: string }>;

const filePath = path.join(process.cwd(), "src", "data", "banners.json");

async function readBanners() {
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
    const banners = await readBanners();
    const index = banners.findIndex(
      (item: Record<string, unknown>) => String(item.id) === String(id),
    );

    if (index < 0) {
      return NextResponse.json(
        { message: "Không tìm thấy banner." },
        { status: 404 },
      );
    }

    const nextBanner = {
      ...banners[index],
      ...payload,
      id: banners[index].id,
    };

    banners[index] = nextBanner;
    await fs.writeFile(filePath, JSON.stringify(banners, null, 2), "utf8");

    return NextResponse.json({ ok: true, banner: nextBanner });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không cập nhật được banner.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = await params;
    const banners = await readBanners();
    const nextBanners = banners.filter(
      (item: Record<string, unknown>) => String(item.id) !== String(id),
    );

    if (nextBanners.length === banners.length) {
      return NextResponse.json(
        { message: "Không tìm thấy banner." },
        { status: 404 },
      );
    }

    await fs.writeFile(filePath, JSON.stringify(nextBanners, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không xóa được banner.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
