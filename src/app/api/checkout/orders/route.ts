import { NextResponse } from "next/server";

import { addOrder } from "@/lib/server/orderStore";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      order?: Record<string, unknown>;
    };

    const order = body.order;

    if (!order || typeof order !== "object") {
      return NextResponse.json(
        { error: "Thiếu dữ liệu đơn hàng." },
        { status: 400 },
      );
    }

    const items = Array.isArray(order.items) ? order.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng đang trống." },
        { status: 400 },
      );
    }

    const paymentMethod =
      typeof order.paymentMethod === "string" ? order.paymentMethod : "cod";

    const nextOrder = {
      id: crypto.randomUUID(),
      ...order,
      items,
      paymentMethod,
      paymentStatus:
        paymentMethod === "bank_transfer"
          ? "pending"
          : typeof order.paymentStatus === "string"
            ? order.paymentStatus
            : "unpaid",
      status:
        paymentMethod === "bank_transfer"
          ? "Chờ thanh toán"
          : typeof order.status === "string"
            ? order.status
            : "Chờ xác nhận",
      createdAt:
        typeof order.createdAt === "string"
          ? order.createdAt
          : new Date().toISOString(),
    };

    addOrder(nextOrder);

    return NextResponse.json({
      ok: true,
      order: nextOrder,
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể tạo đơn hàng lúc này." },
      { status: 500 },
    );
  }
}
