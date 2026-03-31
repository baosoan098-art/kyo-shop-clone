import { promises as fs } from "fs";
import path from "path";

import { NextResponse } from "next/server";

type StoredUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role?: "admin" | "user";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(
      body?.identifier ?? body?.account ?? body?.username ?? body?.email ?? "",
    ).trim();
    const password = String(body?.password ?? "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập tài khoản/email và mật khẩu." },
        { status: 400 },
      );
    }

    const normalizedIdentifier = identifier.toLowerCase();
    const users = await readUsers();

    const user = users.find((item) => {
      const username = item.username?.trim().toLowerCase() ?? "";
      const email = item.email?.trim().toLowerCase() ?? "";

      return username === normalizedIdentifier || email === normalizedIdentifier;
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu." },
        { status: 401 },
      );
    }

    const hasAdmin = users.some((item) => item.role === "admin");
    const resolvedRole = user.role ?? (hasAdmin ? "user" : "admin");

    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công.",
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone ?? "",
        role: resolvedRole,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể đăng nhập lúc này." },
      { status: 500 },
    );
  }
}
