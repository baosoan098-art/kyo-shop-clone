import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

type StoredUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  password: string;
  createdAt: string;
};

const USERS_FILE_PATH = path.join(process.cwd(), "src", "data", "users.json");

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(USERS_FILE_PATH, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body?.fullName ?? "").trim();
    const username = String(body?.username ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const normalizedPhone = phone.replace(/\D/g, "");
    const password = String(body?.password ?? "");
    const confirmPassword = String(body?.confirmPassword ?? "");

    if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ họ tên, tài khoản, email, số điện thoại và mật khẩu." },
        { status: 400 },
      );
    }

    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Email đăng ký phải dùng đuôi @gmail.com." },
        { status: 400 },
      );
    }

    if (normalizedPhone.length !== 10) {
      return NextResponse.json(
        { error: "Số điện thoại phải đúng 10 số." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Nhập lại mật khẩu chưa khớp." }, { status: 400 });
    }

    const users = await readUsers();
    const normalizedUsername = username.toLowerCase();

    const duplicatedUsername = users.some(
      (user) => user.username.trim().toLowerCase() === normalizedUsername,
    );

    if (duplicatedUsername) {
      return NextResponse.json({ error: "Tài khoản này đã tồn tại." }, { status: 409 });
    }

    const duplicatedEmail = users.some(
      (user) => user.email.trim().toLowerCase() === email,
    );

    if (duplicatedEmail) {
      return NextResponse.json({ error: "Email này đã tồn tại." }, { status: 409 });
    }

    const hasAdmin = users.some((user) => user.role === "admin");
    const nextUser: StoredUser = {
      id: randomUUID(),
      fullName,
      username,
      email,
      phone: normalizedPhone,
      role: hasAdmin ? "user" : "admin",
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(nextUser);
    await writeUsers(users);

    return NextResponse.json({
      success: true,
      message: "Đăng ký thành công.",
      user: {
        id: nextUser.id,
        fullName: nextUser.fullName,
        username: nextUser.username,
        email: nextUser.email,
        phone: nextUser.phone,
        role: nextUser.role,
        createdAt: nextUser.createdAt,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể đăng ký tài khoản lúc này." },
      { status: 500 },
    );
  }
}
