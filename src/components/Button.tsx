"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "success" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium text-body transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary/80 focus:ring-primary",
    success: "bg-success text-white hover:bg-success/80 focus:ring-success",
    danger: "bg-error text-white hover:bg-error/80 focus:ring-error",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
