"use server";

import { apiClient } from "@/lib/api";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const login = async (username: string, password: string) => {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Invalid credentials");
  }
  return res;
};

export const register = async (username: string, password: string) => {
  return apiClient<void>("/auth/register", {
    params: {
      username: username,
      password: password,
    },
    cache: "no-store",
    method: "POST",
  });
};
