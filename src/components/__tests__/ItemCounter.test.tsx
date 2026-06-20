import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ItemCounter from "../ItemCounter";

describe("ItemCounter", () => {
  it("displays the current value", () => {
    render(<ItemCounter value={3} onIncrement={vi.fn()} onDecrement={vi.fn()} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onIncrement when + is clicked", async () => {
    const inc = vi.fn();
    render(<ItemCounter value={2} onIncrement={inc} onDecrement={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(inc).toHaveBeenCalledOnce();
  });

  it("calls onDecrement when - is clicked", async () => {
    const dec = vi.fn();
    render(<ItemCounter value={2} onIncrement={vi.fn()} onDecrement={dec} />);
    await userEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(dec).toHaveBeenCalledOnce();
  });

  it("disables decrement at min value", () => {
    render(<ItemCounter value={1} onIncrement={vi.fn()} onDecrement={vi.fn()} min={1} />);
    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
  });

  it("disables increment at max value", () => {
    render(<ItemCounter value={99} onIncrement={vi.fn()} onDecrement={vi.fn()} max={99} />);
    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
  });
});
