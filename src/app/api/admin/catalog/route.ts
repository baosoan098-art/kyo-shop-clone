import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RESOURCE_MAP = {
  products: "products.json",
  lipsticks: "lipsticks.json",
  perfumes: "perfumes.json",
} as const;

type ResourceKey = keyof typeof RESOURCE_MAP;

function filePath(resource: ResourceKey) {
  return path.join(process.cwd(), "src", "data", RESOURCE_MAP[resource]);
}

async function readResource(resource: ResourceKey) {
  const raw = await fs.readFile(filePath(resource), "utf8");
  const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
  return Array.isArray(parsed) ? parsed : [];
}

async function writeResource(resource: ResourceKey, data: Array<Record<string, unknown>>) {
  await fs.writeFile(filePath(resource), JSON.stringify(data, null, 2), "utf8");
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCategories(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";
  const resourceFilter = searchParams.get("resource");

  const resources = (resourceFilter && resourceFilter in RESOURCE_MAP
    ? [resourceFilter as ResourceKey]
    : (Object.keys(RESOURCE_MAP) as ResourceKey[]));

  const collections = await Promise.all(
    resources.map(async (resource) => {
      const items = await readResource(resource);

      return items.map((item) => ({
        ...item,
        resource,
      }));
    }),
  );

  let items = collections.flat();

  if (q) {
    items = items.filter((item) =>
      [
        item.name,
        item.brand,
        item.origin,
        Array.isArray(item.categories) ? item.categories.join(" ") : "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const resource = (body.resource as ResourceKey) || "products";

  if (!(resource in RESOURCE_MAP)) {
    return NextResponse.json({ message: "Resource không hợp lệ." }, { status: 400 });
  }

  const items = await readResource(resource);
  const maxId = items.reduce((current, item) => {
    const value = Number(item.id);
    return Number.isFinite(value) && value > current ? value : current;
  }, 0);

  const nextItem = {
    id: maxId + 1,
    name: normalizeText(body.name),
    brand: normalizeText(body.brand),
    price: normalizeNumber(body.price),
    oldPrice: normalizeNumber(body.oldPrice),
    image: normalizeText(body.image),
    hoverImage: normalizeText(body.hoverImage),
    categories: normalizeCategories(body.categories),
    origin: normalizeText(body.origin),
    sectionLabel: normalizeText(body.sectionLabel),
    stockStatus: normalizeText(body.stockStatus) || "in_stock",
    stock: body.stock === undefined ? undefined : normalizeNumber(body.stock),
  };

  items.push(nextItem);
  await writeResource(resource, items);

  return NextResponse.json({ item: nextItem }, { status: 201 });
}
