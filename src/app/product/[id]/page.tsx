import Link from "next/link";
import { notFound } from "next/navigation";
import ProductComments from "@/components/ProductComments";
import ProductDetailGallery from "@/components/ProductDetailGallery";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import ProductCard from "@/components/ProductCard";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import giftProducts from "@/data/products.json";
import lipstickProducts from "@/data/lipsticks.json";
import perfumeProducts from "@/data/perfumes.json";
import {
  allCatalogProducts,
  getCatalogProductBySlug,
  getRelatedCatalogProducts,
} from "@/lib/catalog";

function formatPrice(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

function buildIntro(productName: string, category: string, origin: string) {
  return `${productName} là lựa chọn nổi bật trong nhóm ${category.toLowerCase()}, phù hợp cho khách đang tìm một sản phẩm đẹp mắt, dễ dùng và có xuất xứ ${origin.toLowerCase()}. Thiết kế gọn gàng, tông hình ảnh sang và mức giá dễ chọn giúp sản phẩm này phù hợp để mua dùng hoặc làm quà tặng.`;
}

function getRawProductMeta(slug: string) {
  const allProducts = [
    ...giftProducts.map((item) => ({ ...item, slug: `gift-${item.id}` })),
    ...lipstickProducts.map((item) => ({ ...item, slug: `lipstick-${item.id}` })),
    ...perfumeProducts.map((item) => ({ ...item, slug: `perfume-${item.id}` })),
  ];

  return allProducts.find((item) => item.slug === slug);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getCatalogProductBySlug(id);

  if (!product) {
    notFound();
  }

  const primaryCategory = product.categories[0] ?? product.sectionLabel;
  const relatedProducts = getRelatedCatalogProducts(product, 4);
  const sidebarProducts = allCatalogProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 5);
  const rawProductMeta = getRawProductMeta(product.slug);

  return (
    <div className="bg-[#f7f3f4]">
      <section className="mx-auto max-w-[1460px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-[24px] border border-[#f0e3e7] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <div className="bg-[#ee5b94] px-5 py-3 text-[1.1rem] font-semibold text-white">
                Sản phẩm khuyến mãi
              </div>

              <div className="space-y-5 p-5">
                {sidebarProducts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/product/${item.slug}`}
                    className="flex gap-4 rounded-2xl transition hover:bg-[#fff8fb]"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#fffdfb]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-[1rem] font-medium leading-7 text-slate-900">
                        {item.name}
                      </h3>
                      <div className="mt-2 text-sm tracking-[0.14em] text-[#d3c8cc]">
                        {"☆".repeat(5)}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="whitespace-nowrap text-[0.95rem] text-[#f08a8a] line-through">
                          {formatPrice(item.oldPrice)}
                        </span>
                        <span className="whitespace-nowrap text-[1rem] font-bold text-[#ea1b0a]">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-[#f0e3e7] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
              <div className="bg-[#ee5b94] px-5 py-3 text-[1.1rem] font-semibold text-white">
                Có thể bạn quan tâm
              </div>

              <div className="space-y-5 p-5">
                {relatedProducts.map((item) => (
                  <Link
                    key={`interest-${item.slug}`}
                    href={`/product/${item.slug}`}
                    className="flex gap-4 rounded-2xl transition hover:bg-[#fff8fb]"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#fffdfb]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-3 text-[1rem] font-medium leading-7 text-slate-900">
                        {item.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="whitespace-nowrap text-[0.95rem] text-[#f08a8a] line-through">
                          {formatPrice(item.oldPrice)}
                        </span>
                        <span className="whitespace-nowrap text-[1rem] font-bold text-[#ea1b0a]">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#efe4e8] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-7">
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">
                <div>
                  <div className="mb-5 text-[0.98rem] text-[#a08f96]">
                    <Link href="/" className="transition hover:text-[#ee4d8c]">
                      Trang chủ
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/shop" className="transition hover:text-[#ee4d8c]">
                      {product.sectionLabel}
                    </Link>
                    <span className="mx-2">/</span>
                    <span>{product.brand}</span>
                  </div>

                  <h1 className="max-w-[820px] text-[2rem] font-semibold leading-[1.28] text-slate-900 sm:text-[2.35rem]">
                    {product.name}
                  </h1>

                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <span className="text-[1.8rem] font-bold text-[#ea1b0a] sm:text-[2.1rem]">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[1.15rem] text-[#f08a8a] line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span className="rounded-full bg-[#fff0f6] px-3 py-1 text-sm font-semibold text-[#ee4d8c]">
                      Giảm {product.discount}%
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-[#fff4f8] px-4 py-2 text-sm font-medium text-[#d1578f]">
                      Danh mục: {product.categories.join(" • ")}
                    </span>
                    <span className="rounded-full bg-[#fff4f8] px-4 py-2 text-sm font-medium text-[#d1578f]">
                      Xuất xứ: {product.origin}
                    </span>
                    <span className="rounded-full bg-[#fff4f8] px-4 py-2 text-sm font-medium text-[#d1578f]">
                      Thương hiệu: {product.brand}
                    </span>
                  </div>

                  <p className="mt-6 text-[1.05rem] leading-9 text-slate-700">
                    {buildIntro(product.name, primaryCategory, product.origin)}
                  </p>

                  <ProductPurchasePanel
                    product={{
                      slug: product.slug,
                      name: product.name,
                      image: product.image,
                      hoverImage: product.hoverImage,
                      price: product.price,
                      oldPrice: product.oldPrice,
                      brand: product.brand,
                      origin: product.origin,
                      sectionLabel: product.sectionLabel,
                      categories: product.categories,
                      stockStatus:
                        typeof rawProductMeta?.stockStatus === "string"
                          ? rawProductMeta.stockStatus
                          : undefined,
                      stock:
                        typeof rawProductMeta?.stock === "number"
                          ? rawProductMeta.stock
                          : undefined,
                    }}
                  />

                  <div className="mt-8 rounded-[24px] border border-[#efe4e8] bg-[#fffdfd] p-5">
                    <h2 className="text-[1.45rem] font-semibold text-slate-900">
                      Chi tiết sản phẩm
                    </h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#fff7fa] px-4 py-3">
                        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#d1578f]">
                          Tên sản phẩm
                        </p>
                        <p className="mt-2 text-[0.95rem] leading-7 text-slate-800">
                          {product.name}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fff7fa] px-4 py-3">
                        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#d1578f]">
                          Giá bán
                        </p>
                        <p className="mt-2 text-[0.95rem] leading-7 text-slate-800">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fff7fa] px-4 py-3">
                        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#d1578f]">
                          Categories
                        </p>
                        <p className="mt-2 text-[0.95rem] leading-7 text-slate-800">
                          {product.categories.join(" • ")}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#fff7fa] px-4 py-3">
                        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#d1578f]">
                          Origin
                        </p>
                        <p className="mt-2 text-[0.95rem] leading-7 text-slate-800">
                          {product.origin}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <ProductDetailGallery
                    name={product.name}
                    image={product.image}
                    hoverImage={product.hoverImage}
                  />

                  <div className="mt-6 rounded-[24px] border border-[#efe4e8] bg-white p-5">
                    <h2 className="text-[1.5rem] font-semibold text-slate-900">
                      Hỗ trợ mua hàng
                    </h2>
                    <div className="mt-4 space-y-3 text-[1.06rem] text-slate-800">
                      <p>
                        <span className="font-semibold">Hotline:</span> 0975 436 989
                      </p>
                      <p>
                        <span className="font-semibold">Zalo / iMessage:</span> hỗ
                        trợ nhanh trong ngày
                      </p>
                      <p className="text-[#ee4d8c]">
                        Hàng chính hãng, kiểm tra trước khi nhận.
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        className="rounded-2xl bg-[#ee2f78] px-6 py-4 text-[1.2rem] font-semibold text-white transition hover:bg-[#dd246b]"
                      >
                        Gọi ngay
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-[#ee2f78] bg-white px-6 py-4 text-[1.2rem] font-semibold text-[#ee2f78] transition hover:bg-[#fff4f8]"
                      >
                        Chat Zalo
                      </button>
                    </div>

                    <p className="mt-5 text-[1rem] leading-8 text-slate-600">
                      Tư vấn 24/7, giao hàng toàn quốc, hỗ trợ quà tặng và set quà
                      theo nhu cầu.
                    </p>
                  </div>
                </div>
                <div className="xl:col-span-2">
                  <ProductDetailTabs
                    name={product.name}
                    brand={product.brand}
                    origin={product.origin}
                    categories={product.categories}
                    price={product.price}
                  />
                </div>
              </div>
            </section>

            <ProductComments productName={product.name} productKey={product.slug} />

            <section className="rounded-[28px] border border-[#efe4e8] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
              <h2 className="text-[2rem] font-semibold text-slate-900">
                Sản phẩm tương tự
              </h2>

              <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={`related-${item.slug}`} product={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
