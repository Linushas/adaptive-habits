import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
