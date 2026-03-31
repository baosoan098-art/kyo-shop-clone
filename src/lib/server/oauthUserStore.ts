import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { repairVietnameseText } from "@/lib/repairVietnameseText";

export type StoredUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
  provider?: "google" | "facebook";
  providerId?: string;
  avatar?: string;
};

export type OAuthProfile = {
  provider: "google" | "facebook";
  providerId: string;
  fullName: string;
  email: string;
  avatar?: string;
};

const usersPath = path.join(process.cwd(), "src", "data", "users.json");

async function readUsers() {
  const file = await fs.readFile(usersPath, "utf8");
  return JSON.parse(file) as StoredUser[];
}

async function writeUsers(users: StoredUser[]) {
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");
}

function slugifyUsername(input: string) {
  return (
    input
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .trim() || "user"
  );
}

function buildUniqueUsername(users: StoredUser[], baseSeed: string) {
  const base = slugifyUsername(baseSeed);
  const existing = new Set(users.map((user) => user.username.toLowerCase()));

  if (!existing.has(base)) {
    return base;
  }

  let index = 2;
  while (existing.has(`${base}${index}`)) {
    index += 1;
  }

  return `${base}${index}`;
}

export async function upsertOAuthUser(profile: OAuthProfile) {
  const users = await readUsers();
  const email = profile.email.trim().toLowerCase();
  const fullName = repairVietnameseText(profile.fullName.trim());
  const now = new Date().toISOString();

  const existingIndex = users.findIndex(
    (user) =>
      user.email.trim().toLowerCase() === email ||
      (user.provider === profile.provider &&
        user.providerId === profile.providerId),
  );

  if (existingIndex >= 0) {
    const nextUser: StoredUser = {
      ...users[existingIndex],
      fullName: fullName || users[existingIndex].fullName,
      email,
      provider: profile.provider,
      providerId: profile.providerId,
      avatar: profile.avatar || users[existingIndex].avatar,
    };

    users[existingIndex] = nextUser;
    await writeUsers(users);
    return nextUser;
  }

  const nextUser: StoredUser = {
    id: randomUUID(),
    fullName: fullName || "Người dùng mới",
    username: buildUniqueUsername(
      users,
      email.split("@")[0] || profile.fullName || profile.provider,
    ),
    email,
    phone: "",
    password: "",
    role: "user",
    createdAt: now,
    provider: profile.provider,
    providerId: profile.providerId,
    avatar: profile.avatar,
  };

  users.push(nextUser);
  await writeUsers(users);

  return nextUser;
}
