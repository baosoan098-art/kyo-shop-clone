import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

type RouteParams = Promise<{ id: string }>;

const filePath = path.join(process.cwd(), "src", "data", "users.json");

async function readUsers() {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as Record<string, unknown>;
    const users = await readUsers();
    const index = users.findIndex(
      (item: Record<string, unknown>) => String(item.id) === String(id),
    );

    if (index < 0) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    const nextUser = {
      ...users[index],
      ...payload,
      id: users[index].id,
    };

    users[index] = nextUser;
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf8");

    return NextResponse.json({ ok: true, user: nextUser });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không cập nhật được tài khoản.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: RouteParams },
) {
  try {
    const { id } = await params;
    const users = await readUsers();
    const nextUsers = users.filter(
      (item: Record<string, unknown>) => String(item.id) !== String(id),
    );

    if (nextUsers.length === users.length) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 },
      );
    }

    await fs.writeFile(filePath, JSON.stringify(nextUsers, null, 2), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không xóa được tài khoản.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
