import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  buildBannerPayload,
  readBanners,
  writeBanners,
} from "@/lib/server/bannerStore";

export async function GET() {
  const banners = await readBanners();

  return NextResponse.json({ items: banners });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const payload = buildBannerPayload(body);

  if (!payload.title) {
    return NextResponse.json(
      { message: "Tiêu đề banner là bắt buộc." },
      { status: 400 },
    );
  }

  const banners = await readBanners();
  const now = new Date().toISOString();

  const nextBanner = {
    id: randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  banners.push(nextBanner);
  await writeBanners(banners);

  return NextResponse.json({ item: nextBanner }, { status: 201 });
}
