import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

function isGmail(email: string) {
  return email.toLowerCase().endsWith("@gmail.com");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const fullName = body.fullName?.trim();
    const username = body.username?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const password = body.password?.trim();

    if (!fullName || !username || !email || !phone || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập đủ thông tin." },
        { status: 400 },
      );
    }

    if (!isGmail(email)) {
      return NextResponse.json(
        { message: "Email phải là @gmail.com." },
        { status: 400 },
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { message: "Số điện thoại phải đủ 10 số." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu tối thiểu 6 ký tự." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({
      $or: [{ username }, { email }],
    });

    if (existing) {
      return NextResponse.json(
        { message: "Tài khoản hoặc email đã tồn tại." },
        { status: 409 },
      );
    }

    const newUser = {
      id: crypto.randomUUID(),
      fullName,
      username,
      email,
      phone,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    await users.insertOne(newUser);

    const { password: _pw, ...safeUser } = newUser;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Đăng ký thất bại.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
