"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type BannerItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  href: string;
  active: boolean;
  sortOrder: number;
};

const fallbackBanners: BannerItem[] = [
  {
    id: "fallback-1",
    title: "KYO AUTHENTIC",
    subtitle: "Cosmetics",
    description: "",
    image: "/images/banner-kyo-1.jpg",
    buttonText: "Shop now",
    href: "/shop",
    active: true,
    sortOrder: 1,
  },
  {
    id: "fallback-2",
    title: "KYO AUTHENTIC",
    subtitle: "Holiday Sale",
    description: "",
    image: "/images/banner-kyo-3-2048x1024.jpg",
    buttonText: "Xem ngay",
    href: "/shop",
    active: true,
    sortOrder: 2,
  },
  {
    id: "fallback-3",
    title: "KYO AUTHENTIC",
    subtitle: "New Collection",
    description: "",
    image: "/images/banner-kyo-4-2048x1024%20(1).jpg",
    buttonText: "Khám phá",
    href: "/shop",
    active: true,
    sortOrder: 3,
  },
];

function buildClassicBannerImage(index: number) {
  const themes = [
    {
      accent: "#ff1f4e",
      olive: "#6e6f4f",
      gift: "#d2424d",
      gold: "#d1a53b",
      ribbon: "#a90d2e",
    },
    {
      accent: "#ec3671",
      olive: "#5c674b",
      gift: "#d64556",
      gold: "#d7aa42",
      ribbon: "#b3133a",
    },
  ];

  const tone = themes[index % themes.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 560">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f6f0ea"/>
          <stop offset="100%" stop-color="#eee3d8"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#000000" flood-opacity="0.1"/>
        </filter>
      </defs>
      <rect width="1600" height="560" fill="url(#bg)"/>
      <g opacity="0.18">
        <circle cx="230" cy="90" r="130" fill="#ffffff"/>
        <circle cx="1380" cy="470" r="160" fill="#ffffff"/>
        <circle cx="770" cy="180" r="220" fill="#ffffff"/>
      </g>

      <g>
        <path d="M-20 0h260l-38 30 28 28-44 28 22 30-58 6 24 24-70 4-18 34-34-18-28 22-20-36-40 10 10-42-46-8 18-30-40-20 28-24-24-30 54 4z" fill="#466343"/>
        <path d="M1380 560h260l-36-34 28-24-44-30 18-26-58-10 24-20-70-12-18-32-34 20-28-22-22 34-38-10 12 44-48 6 18 28-38 24 28 20-22 26 50 2z" fill="#466343"/>
        <path d="M70 20c56 12 124 44 176 92" stroke="${tone.gold}" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M1300 466c62-18 144-8 222 38" stroke="${tone.gold}" stroke-width="12" fill="none" stroke-linecap="round"/>
      </g>

      <g>
        <circle cx="110" cy="120" r="42" fill="${tone.ribbon}"/>
        <circle cx="222" cy="72" r="22" fill="${tone.gold}"/>
        <circle cx="1286" cy="470" r="30" fill="${tone.gold}"/>
        <circle cx="1352" cy="502" r="22" fill="${tone.ribbon}"/>
      </g>

      <g filter="url(#shadow)">
        <rect x="38" y="268" width="196" height="116" rx="6" fill="#fff4ef"/>
        <rect x="38" y="304" width="196" height="14" fill="${tone.gift}"/>
        <rect x="118" y="268" width="14" height="116" fill="${tone.gold}"/>
        <path d="M34 372l36-18 24 30 22-26 22 26 24-30 36 18-28 10 14 24-32-10-22 18-14-26-14 26-22-18-32 10 14-24z" fill="${tone.gold}"/>
      </g>

      <g filter="url(#shadow)">
        <rect x="1382" y="224" width="184" height="126" rx="8" fill="${tone.gift}"/>
        <rect x="1382" y="260" width="184" height="16" fill="${tone.gold}"/>
        <rect x="1464" y="224" width="16" height="126" fill="#f7efe4"/>
        <path d="M1368 334l38-18 20 30 26-26 20 26 24-30 38 18-30 12 16 24-36-10-22 16-18-26-14 26-24-16-34 10 16-24z" fill="${tone.gold}"/>
      </g>

      <g opacity="0.85">
        <path d="M464 130h180v4H468v212h-4z" fill="#8f7d77"/>
        <path d="M1116 130h180v216h-4V134h-176z" fill="#8f7d77"/>
        <path d="M492 344h180v4H464v-24h4z" fill="#8f7d77"/>
        <path d="M1116 344h180v4h-208v-4z" fill="#8f7d77"/>
      </g>

      <text x="800" y="156" text-anchor="middle" fill="${tone.accent}" font-size="56" font-style="italic" font-family="Brush Script MT, Segoe Script, cursive">
        Cosmetics
      </text>
      <text x="800" y="248" text-anchor="middle" fill="${tone.olive}" font-size="92" font-weight="800" font-family="Segoe UI, Arial, sans-serif">
        KYO
      </text>
      <text x="800" y="336" text-anchor="middle" fill="${tone.olive}" font-size="92" font-weight="800" font-family="Segoe UI, Arial, sans-serif">
        AUTHENTIC
      </text>
      <text x="800" y="434" text-anchor="middle" fill="${tone.accent}" font-size="30" letter-spacing="12" font-weight="800" font-family="Segoe UI, Arial, sans-serif">
        UP TO 50% OFF
      </text>

      <g filter="url(#shadow)">
        <rect x="656" y="466" width="288" height="74" rx="18" fill="${tone.olive}"/>
        <text x="800" y="514" text-anchor="middle" fill="#ffffff" font-size="34" font-weight="800" font-family="Segoe UI, Arial, sans-serif">
          SHOP NOW
        </text>
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function HeroCarousel() {
  const [items, setItems] = useState<BannerItem[]>(fallbackBanners);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ignore = false;

    fetch("/api/banners", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { items?: BannerItem[] }) => {
        if (ignore) {
          return;
        }

        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          setActiveIndex(0);
        }
      })
      .catch(() => {
        // Giữ banner fallback khi API chưa tải được.
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [items.length]);

  const currentItem = items[activeIndex] ?? fallbackBanners[0];
  const currentImage = useMemo(
    () => currentItem.image || buildClassicBannerImage(activeIndex),
    [activeIndex, currentItem.image],
  );

  function goToSlide(nextIndex: number) {
    const total = items.length;
    setActiveIndex((nextIndex + total) % total);
  }

  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden bg-white">
        <Link
          href={currentItem.href || "/shop"}
          className="block"
          aria-label={currentItem.title || "Mở banner"}
        >
          <img
            src={currentImage}
            alt={currentItem.title || "Banner KYO Authentic"}
            className="h-[440px] w-full object-cover sm:h-[560px] lg:h-[680px]"
          />
        </Link>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              className="absolute left-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-2xl font-light text-[#ee4d8c] shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:bg-white"
              aria-label="Banner trước"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              className="absolute right-4 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-2xl font-light text-[#ee4d8c] shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:bg-white"
              aria-label="Banner sau"
            >
              ›
            </button>
          </>
        ) : null}

        {items.length > 1 ? (
          <div className="flex items-center justify-center gap-3 px-6 py-5">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-3.5 rounded-full transition ${
                  index === activeIndex
                    ? "w-10 bg-[#ee4d8c]"
                    : "w-3.5 bg-[#f0d3dc]"
                }`}
                aria-label={`Chuyển tới banner ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
