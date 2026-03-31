import { NextResponse } from "next/server";

import {
  readOrders,
  updateOrderById,
  writeOrders,
} from "@/lib/server/orderStore";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const updatedOrder = updateOrderById(id, body);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      order: updatedOrder,
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể cập nhật đơn hàng." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const orders = readOrders();
    const nextOrders = orders.filter((order) => String(order.id) !== id);

    if (nextOrders.length === orders.length) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng." },
        { status: 404 },
      );
    }

    writeOrders(nextOrders);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Không thể xóa đơn hàng." },
      { status: 500 },
    );
  }
}
