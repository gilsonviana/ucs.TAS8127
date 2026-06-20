"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

interface LoginResponse {
  token: string;
  user: { id: number; name: string; email: string; role: "customer" | "admin" };
}

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth.adminLogin");
  const tAuth = useTranslations("auth.login");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const res = await axios.post<LoginResponse>("/api/admin/login", data);
      login(res.data.token, res.data.user);
      router.push("/admin" as "/");
    } catch {
      setServerError(t("invalidCredentials"));
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-dark">
      <div className="w-full max-w-md bg-void rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <div>
          <span className="text-primary font-bold text-title">⚡</span>
          <span className="text-white font-bold text-body-bold ml-2">TechStore</span>
          <h1 className="text-section-title font-bold text-white mt-3">{t("title")}</h1>
          <p className="text-xs-body text-gray-400">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextInput label={tAuth("email")} id="email" type="email" error={errors.email?.message} {...register("email")} />
          <TextInput label={tAuth("password")} id="password" type="password" error={errors.password?.message} {...register("password")} />

          {serverError && <p className="text-sm text-error" role="alert">{serverError}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "..." : tAuth("submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
