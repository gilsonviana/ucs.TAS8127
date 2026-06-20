import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import IconButton from "../IconButton";

describe("IconButton", () => {
  it("renders with aria-label", () => {
    render(<IconButton label="Add to cart">+</IconButton>);
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
  });

  it("calls onClick handler", async () => {
    const handler = vi.fn();
    render(<IconButton label="Click me" onClick={handler}>X</IconButton>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<IconButton label="Disabled" disabled>X</IconButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
