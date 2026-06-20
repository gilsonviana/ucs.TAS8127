"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-dark">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 rounded-md border bg-white text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition
            ${error ? "border-error focus:ring-error" : "border-gray-300"}
            ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
