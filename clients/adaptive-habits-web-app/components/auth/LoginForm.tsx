"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { loginAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const initialState = { error: "" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );
  const errorMessage = state?.error || "";

  return (
    <>
      <form action={formAction} className="space-y-6 w-full">
        {errorMessage && (
          <div className="bg-red-300 text-bg-dark text-sm p-3 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        <h2 className="text-fg text-2xl">Login</h2>

        <Input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="Username"
        />

        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      <a href="/register" className="text-fg text-sm">
        Register new user
      </a>
    </>
  );
}
