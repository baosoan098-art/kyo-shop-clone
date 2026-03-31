import { NextResponse } from "next/server";

import { readDataArray } from "@/lib/server/dataStore";

export const runtime = "nodejs";

type OrderItem = {
  id: string;
  orderNumber?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  total?: number;
  status?: string;
  createdAt?: string;
  items?: Array<{
    id?: string;
    name?: string;
    image?: string;
    price?: number;
    quantity?: number;
  }>;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const keyword = String(url.searchParams.get("q") ?? "").trim().toLowerCase();
    let orders = await readDataArray<OrderItem>("orders");

    orders = [...orders].sort((left, right) =>
      String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? "")),
    );

    if (keyword) {
      orders = orders.filter((order) =>
        [
          order.orderNumber,
          order.customer?.fullName,
          order.customer?.email,
          order.customer?.phone,
          order.status,
        ].some((value) => String(value ?? "").toLowerCase().includes(keyword)),
      );
    }

    return NextResponse.json({ items: orders });
  } catch {
    return NextResponse.json(
      { error: "Không thể tải danh sách đơn hàng." },
      { status: 500 },
    );
  }
}
