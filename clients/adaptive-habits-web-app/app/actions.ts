'use server'

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createHabit } from "@/services/habits";
import { HabitModel } from "@/types";
import { redirect } from "next/navigation";
import { login, register } from "@/services/auth";

export async function loginAction(prevState: any, formData: FormData) {
    try {
        const username = formData.get("username");
        const password = formData.get("password");
        const res: Response = await login(username as string, password as string);

        const setCookieHeader = res.headers.get("set-cookie");
        if(setCookieHeader) {
            const cookieStore = await cookies();
            const chunks = setCookieHeader.split(/,(?=\s*\w+=)/);
            
            chunks.forEach(chunk => {
                const part = chunk.split(';')[0];
                const [key, value] = part.split('=');
                if (key && value) {
                    cookieStore.set({
                        name: key.trim(),
                        value: value.trim(),
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                    });
                }
            });
        }
    } catch (e) {
        return { error: "Login failed" };
    }

    redirect("/");
}

export async function registerAction(prevState: any, formData: FormData) {
    try {
        const username = formData.get("username");
        const password = formData.get("password");
        await register(username as string, password as string);
    } catch (e) {
        return { error: "Creating new user failed" };
    }

    await loginAction(prevState, formData);
    redirect("/");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    redirect("/login");
}

export async function addHabitAction(habit: HabitModel) {
    await createHabit(habit);
    revalidatePath('/');
}

// deleteHabitAction

// updateHabitAction
