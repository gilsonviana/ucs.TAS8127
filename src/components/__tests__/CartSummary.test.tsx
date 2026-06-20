import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CartSummary from "../CartSummary";

describe("CartSummary", () => {
  it("renders subtotal", () => {
    render(<CartSummary total={100} onCheckout={vi.fn()} />);
    expect(screen.getByText("subtotal")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("renders freight cost", () => {
    render(<CartSummary total={100} onCheckout={vi.fn()} />);
    expect(screen.getByText("freight")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("renders total order with correct sum", () => {
    render(<CartSummary total={100} onCheckout={vi.fn()} />);
    expect(screen.getByText("totalOrder")).toBeInTheDocument();
    expect(screen.getByText("$109.99")).toBeInTheDocument();
  });

  it("renders checkout button", () => {
    render(<CartSummary total={100} onCheckout={vi.fn()} />);
    expect(screen.getByRole("button", { name: /checkout/i })).toBeInTheDocument();
  });

  it("calls onCheckout when checkout button is clicked", async () => {
    const handleCheckout = vi.fn();
    render(<CartSummary total={100} onCheckout={handleCheckout} />);
    await userEvent.click(screen.getByRole("button", { name: /checkout/i }));
    expect(handleCheckout).toHaveBeenCalledOnce();
  });

  it("disables checkout button when disabled prop is true", () => {
    render(<CartSummary total={100} onCheckout={vi.fn()} disabled />);
    expect(screen.getByRole("button", { name: /checkout/i })).toBeDisabled();
  });

  it("does not call onCheckout when disabled and button is clicked", async () => {
    const handleCheckout = vi.fn();
    render(<CartSummary total={100} onCheckout={handleCheckout} disabled />);
    await userEvent.click(screen.getByRole("button", { name: /checkout/i }));
    expect(handleCheckout).not.toHaveBeenCalled();
  });

  it("calculates total correctly with different amounts", () => {
    const { rerender } = render(<CartSummary total={50} onCheckout={vi.fn()} />);
    expect(screen.getByText("$59.99")).toBeInTheDocument();

    rerender(<CartSummary total={200} onCheckout={vi.fn()} />);
    expect(screen.getByText("$209.99")).toBeInTheDocument();
  });
});
