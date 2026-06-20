"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "clean" | "button" | "ghost";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  children: ReactNode;
  label: string;
}

export default function IconButton({
  variant = "clean",
  children,
  label,
  className = "",
  ...props
}: IconButtonProps) {
  const base =
    "inline-flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-primary rounded-md";

  const variants: Record<IconButtonVariant, string> = {
    clean: "p-1 text-dark border border-gray-200 hover:text-primary hover:border-primary",
    button: "p-2 bg-primary text-white hover:bg-primary/80",
    ghost: "p-1 text-white hover:opacity-80",
  };

  return (
    <button
      aria-label={label}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
