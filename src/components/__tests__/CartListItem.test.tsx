import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CartListItem from "../CartListItem";

describe("CartListItem", () => {
  it("renders product name", () => {
    render(
      <CartListItem
        productId={1}
        name="RTX 4090"
        price={1999.99}
        quantity={2}
        onRemove={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />
    );
    expect(screen.getByText("RTX 4090")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(
      <CartListItem
        productId={1}
        name="Product"
        price={149.99}
        quantity={1}
        onRemove={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />
    );
    expect(screen.getByText("$149.99")).toBeInTheDocument();
  });

  it("renders quantity in ItemCounter", () => {
    render(
      <CartListItem
        productId={1}
        name="Product"
        price={50}
        quantity={5}
        onRemove={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onRemove with productId when remove button is clicked", async () => {
    const handleRemove = vi.fn();
    render(
      <CartListItem
        productId={42}
        name="Product"
        price={50}
        quantity={1}
        onRemove={handleRemove}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(handleRemove).toHaveBeenCalledWith(42);
  });

  it("calls onIncrement when increment button is clicked", async () => {
    const handleIncrement = vi.fn();
    render(
      <CartListItem
        productId={1}
        name="Product"
        price={50}
        quantity={2}
        onRemove={vi.fn()}
        onIncrement={handleIncrement}
        onDecrement={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /increase/i }));
    expect(handleIncrement).toHaveBeenCalledWith(1);
  });

  it("calls onDecrement when decrement button is clicked", async () => {
    const handleDecrement = vi.fn();
    render(
      <CartListItem
        productId={1}
        name="Product"
        price={50}
        quantity={2}
        onRemove={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={handleDecrement}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /decrease/i }));
    expect(handleDecrement).toHaveBeenCalledWith(1);
  });

  it("renders image when imageUrl is provided", () => {
    render(
      <CartListItem
        productId={1}
        name="Product"
        price={50}
        quantity={1}
        imageUrl="/test.jpg"
        onRemove={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />
    );
    const image = screen.getByAltText("Product");
    expect(image).toBeInTheDocument();
  });

  it("renders placeholder when imageUrl is not provided", () => {
    render(
      <CartListItem
        productId={1}
        name="Product"
        price={50}
        quantity={1}
        onRemove={vi.fn()}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
      />
    );
    expect(screen.getByText("noImage")).toBeInTheDocument();
  });
});
