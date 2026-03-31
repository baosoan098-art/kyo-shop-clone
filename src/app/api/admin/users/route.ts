import { NextResponse } from "next/server";

import { readDataArray } from "@/lib/server/dataStore";

export const runtime = "nodejs";

type UserItem = {
  id: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: "admin" | "user";
  password?: string;
  createdAt?: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const keyword = String(url.searchParams.get("q") ?? "").trim().toLowerCase();
    let users = await readDataArray<UserItem>("users");
    const hasAdmin = users.some((user) => user.role === "admin");

    users = users.map((user, index) => ({
      ...user,
      role: user.role ?? (!hasAdmin && index === 0 ? "admin" : "user"),
    }));

    users = [...users].sort((left, right) =>
      String(right.createdAt ?? "").localeCompare(String(left.createdAt ?? "")),
    );

    if (keyword) {
      users = users.filter((user) =>
        [user.fullName, user.username, user.email, user.phone].some((value) =>
          String(value ?? "").toLowerCase().includes(keyword),
        ),
      );
    }

    return NextResponse.json({ items: users });
  } catch {
    return NextResponse.json(
      { error: "Không thể tải danh sách người dùng." },
      { status: 500 },
    );
  }
}
