"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import NavigationBar from "@/components/NavigationBar";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import { useCartStore } from "@/context/CartStore";

const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdateNameForm = z.infer<typeof updateNameSchema>;
type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;

interface User {
  id: number;
  name: string;
  email: string;
}

export default function AccountPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const cartCount = useCartStore((s) => s.totalItems());

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [nameSubmitting, setNameSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const nameForm = useForm<UpdateNameForm>({
    resolver: zodResolver(updateNameSchema),
  });

  const passwordForm = useForm<UpdatePasswordForm>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    axios
      .get<User>("/api/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        setUser(r.data);
        nameForm.setValue("name", r.data.name);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, router, nameForm]);

  const onUpdateName = async (data: UpdateNameForm) => {
    setNameSubmitting(true);
    try {
      await axios.patch(
        "/api/user",
        { name: data.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => (prev ? { ...prev, name: data.name } : null));
      setSuccessMessage(t("account.nameUpdated"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      nameForm.setError("name", {
        message: error.response?.data?.error || t("errors.generic"),
      });
    } finally {
      setNameSubmitting(false);
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordForm) => {
    setPasswordSubmitting(true);
    try {
      await axios.patch(
        "/api/user/password",
        { currentPassword: data.currentPassword, newPassword: data.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      passwordForm.reset();
      setSuccessMessage(t("account.passwordUpdated"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || t("errors.generic");
      if (errorMsg.includes("incorrect")) {
        passwordForm.setError("currentPassword", { message: errorMsg });
      } else {
        passwordForm.setError("newPassword", { message: errorMsg });
      }
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar cartCount={cartCount} isAuthenticated={isAuthenticated} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <h1 className="text-page-title font-normal text-dark mb-8">{t("account.title")}</h1>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-md" />
            <div className="h-32 bg-gray-200 rounded-md" />
          </div>
        ) : (
          <div className="space-y-8">
            {successMessage && (
              <div className="p-4 bg-success/10 border border-success text-success rounded-md">
                {successMessage}
              </div>
            )}

            <div className="border border-gray-200 p-6">
              <h2 className="text-section-title text-dark mb-4">{t("account.userInfo")}</h2>
              <p className="text-sm-body text-gray-600 mb-4">
                {t("account.email")}: {user?.email}
              </p>
            </div>

            <div className="border border-gray-200 p-6">
              <h2 className="text-section-title text-dark mb-6">{t("account.updateName")}</h2>
              <form onSubmit={nameForm.handleSubmit(onUpdateName)} className="space-y-4">
                <TextInput
                  id="name"
                  label={t("auth.register.name")}
                  placeholder={t("auth.register.name")}
                  {...nameForm.register("name")}
                  error={nameForm.formState.errors.name?.message}
                  disabled={nameSubmitting}
                />
                <Button type="submit" variant="primary" disabled={nameSubmitting}>
                  {nameSubmitting ? t("account.updating") : t("account.updateButton")}
                </Button>
              </form>
            </div>

            <div className="border border-gray-200 p-6">
              <h2 className="text-section-title text-dark mb-6">{t("account.changePassword")}</h2>
              <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="space-y-4">
                <TextInput
                  id="currentPassword"
                  label={t("account.currentPassword")}
                  type="password"
                  placeholder={t("account.currentPassword")}
                  {...passwordForm.register("currentPassword")}
                  error={passwordForm.formState.errors.currentPassword?.message}
                  disabled={passwordSubmitting}
                />
                <TextInput
                  id="newPassword"
                  label={t("account.newPassword")}
                  type="password"
                  placeholder={t("account.newPassword")}
                  {...passwordForm.register("newPassword")}
                  error={passwordForm.formState.errors.newPassword?.message}
                  disabled={passwordSubmitting}
                />
                <TextInput
                  id="confirmPassword"
                  label={t("account.confirmPassword")}
                  type="password"
                  placeholder={t("account.confirmPassword")}
                  {...passwordForm.register("confirmPassword")}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  disabled={passwordSubmitting}
                />
                <Button type="submit" variant="primary" disabled={passwordSubmitting}>
                  {passwordSubmitting ? t("account.updating") : t("account.changeButton")}
                </Button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
