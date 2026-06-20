"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
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

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const tErr = useTranslations("errors");
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const res = await axios.post<LoginResponse>("/api/auth/login", data);
      login(res.data.token, res.data.user);
      if (res.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setServerError(tErr("generic"));
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-page-title font-normal text-dark">{t("title")}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextInput
            label={t("email")}
            id="email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextInput
            label={t("password")}
            id="password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          {serverError && (
            <p className="text-sm text-error" role="alert">
              {serverError}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "..." : t("submit")}
          </Button>
        </form>

        <p className="text-sm-body text-center text-gray-500">
          {t("noAccount")}{" "}
          <Link href="/cadastro" className="text-primary hover:underline">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </main>
  );
}
