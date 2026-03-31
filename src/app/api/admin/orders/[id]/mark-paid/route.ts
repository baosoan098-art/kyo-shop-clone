import { NextResponse } from "next/server";

import { updateOrderById } from "@/lib/server/orderStore";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const updatedOrder = updateOrderById(id, {
      paymentStatus: "paid",
      status: "Chờ xác nhận",
      paymentPaidAt: new Date().toISOString(),
    });

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
      { error: "Không thể xác nhận thanh toán." },
      { status: 500 },
    );
  }
}
