import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="bg-bg min-h-full w-full items-center justify-center flex flex-col p-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <RegisterForm />
      </div>
    </div>
  );
}
