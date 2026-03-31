import Link from "next/link";

import {
  getProductPurchaseLabel,
  getProductStockBadgeClassName,
  getProductStockLabel,
  isProductOutOfStock,
} from "@/lib/stock";

type ProductRecord = {
  id?: string | number;
  slug?: string;
  section?: string;
  name?: string;
  title?: string;
  image?: string;
  hoverImage?: string;
  price?: number | string;
  oldPrice?: number | string;
  categories?: string[] | string;
  category?: string;
  [key: string]: unknown;
};

function toPrice(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPrice(value: unknown) {
  return `${toPrice(value).toLocaleString("vi-VN")} đ`;
}

function getProductHref(product: ProductRecord) {
  if (product.slug) {
    return `/product/${product.slug}`;
  }

  if (product.section && product.id !== undefined) {
    return `/product/${product.section}-${product.id}`;
  }

  if (product.id !== undefined) {
    return `/product/${product.id}`;
  }

  return "/shop";
}

function getProductName(product: ProductRecord) {
  return String(product.name || product.title || "Sản phẩm");
}

function getCategoryText(product: ProductRecord) {
  if (Array.isArray(product.categories)) {
    return product.categories.join(" • ");
  }

  if (typeof product.categories === "string" && product.categories.trim()) {
    return product.categories;
  }

  if (typeof product.category === "string" && product.category.trim()) {
    return product.category;
  }

  return product.section === "perfume"
    ? "Nước Hoa"
    : product.section === "lipstick"
      ? "Son Môi"
      : "Quà Tặng";
}

export default function ProductCard({ product }: { product: ProductRecord }) {
  const href = getProductHref(product);
  const productName = getProductName(product);
  const outOfStock = isProductOutOfStock(product);
  const primaryImage = product.image ? String(product.image) : "";
  const secondaryImage = product.hoverImage ? String(product.hoverImage) : primaryImage;

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className="flex h-full flex-col bg-transparent px-3 pb-4 pt-2 transition"
      >
        <div className="relative overflow-hidden rounded-[20px] bg-white">
          <span
            className={`absolute left-3 top-3 z-10 inline-flex rounded-full px-4 py-1.5 text-[0.76rem] font-bold tracking-[0.16em] ${getProductStockBadgeClassName(
              product,
            )}`}
          >
            {getProductStockLabel(product)}
          </span>

          {primaryImage ? (
            <div className="relative h-[260px] w-full overflow-hidden rounded-[20px] bg-white">
              <img
                src={primaryImage}
                alt={productName}
                className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                  secondaryImage && secondaryImage !== primaryImage
                    ? "opacity-100 group-hover:opacity-0"
                    : "opacity-100"
                }`}
              />
              {secondaryImage && secondaryImage !== primaryImage ? (
                <img
                  src={secondaryImage}
                  alt={`${productName} hover`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                />
              ) : null}
            </div>
          ) : (
            <div className="flex h-[260px] w-full items-center justify-center text-sm font-semibold text-[#b48795]">
              Không có ảnh
            </div>
          )}
        </div>

        <div className="mt-5 flex-1 text-center">
          <p className="text-[0.84rem] uppercase tracking-[0.34em] text-[#d26d92]">
            {getCategoryText(product)}
          </p>

          <h3 className="mt-4 line-clamp-3 min-h-[124px] text-[1rem] font-semibold leading-10 text-[#16111d]">
            {productName}
          </h3>

          <div className="mt-4 flex items-end justify-center gap-3">
            {toPrice(product.oldPrice) > 0 ? (
              <span className="text-[0.95rem] text-[#f08a8a] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            ) : null}
            <span className="text-[1.05rem] font-bold text-[#ea1b0a]">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="mt-4 text-[1rem] tracking-[0.34em] text-[#ff4e8f]">
            {"★★★★★"}
          </div>
        </div>

        <div className="mt-6">
          <span
            className={`inline-flex h-14 w-full items-center justify-center rounded-[18px] text-[1rem] font-semibold transition ${
              outOfStock
                ? "border border-[#f2ccd7] bg-[#fff7fa] text-[#d3456d]"
                : "bg-[#ee2f78] text-white hover:bg-[#d92468]"
            }`}
          >
            {getProductPurchaseLabel(product)}
          </span>
        </div>
      </Link>
    </article>
  );
}
