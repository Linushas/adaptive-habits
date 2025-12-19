"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_NAME = "__session";
const REFRESH_TOKEN_NAME = "_r";

type Options = RequestInit & {
  params?: Record<string, string | number | boolean | null | undefined>;
};

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;
  return {
    "Content-Type": "application/json",
    Cookie: `${ACCESS_TOKEN_NAME}=${token}`,
  };
}

export const apiClient = async <T>(
  endpoint: string,
  options: Options = {}
): Promise<T> => {
  const { params, ...init } = options;
  const headers = await getHeaders();
  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const config = {
    ...init,
    headers: {
      ...headers,
      ...init.headers,
    },
    cache: init.cache || "no-store",
  };

  const res = await fetch(url, config);

  if (res.status === 401) {
    redirect("/?refresh=true");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${res.statusText}`);
  }

  return res.json();
};
