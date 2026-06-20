import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "../ProductCard";

describe("ProductCard", () => {
  it("renders product name", () => {
    render(
      <ProductCard
        id={1}
        name="RTX 4090"
        price={1999.99}
        onAddToCart={vi.fn()}
      />
    );
    expect(screen.getByText("RTX 4090")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(
      <ProductCard
        id={1}
        name="GPU"
        price={1999.99}
        onAddToCart={vi.fn()}
      />
    );
    expect(screen.getByText("$1999.99")).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(
      <ProductCard
        id={1}
        name="Product"
        price={100}
        imageUrl="/test.jpg"
        onAddToCart={vi.fn()}
      />
    );
    const image = screen.getByAltText("Product");
    expect(image).toBeInTheDocument();
  });

  it("renders no image placeholder when imageUrl is not provided", () => {
    render(
      <ProductCard
        id={1}
        name="Product"
        price={100}
        onAddToCart={vi.fn()}
      />
    );
    expect(screen.getByText("noImage")).toBeInTheDocument();
  });

  it("calls onAddToCart with product id when add to cart is clicked", async () => {
    const handleAddToCart = vi.fn();
    render(
      <ProductCard
        id={42}
        name="Product"
        price={100}
        onAddToCart={handleAddToCart}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /addToCart/i }));
    expect(handleAddToCart).toHaveBeenCalledWith(42);
  });

  it("renders add to cart button with correct aria label", () => {
    render(
      <ProductCard
        id={1}
        name="Product"
        price={100}
        onAddToCart={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /addToCart/i })).toBeInTheDocument();
  });
});
