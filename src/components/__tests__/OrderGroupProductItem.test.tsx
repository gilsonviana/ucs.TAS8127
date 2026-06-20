import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OrderGroupProductItem from "../OrderGroupProductItem";

describe("OrderGroupProductItem", () => {
  it("renders product name", () => {
    render(
      <OrderGroupProductItem
        name="RTX 4090"
        quantity={1}
        unitPrice={1999.99}
      />
    );
    expect(screen.getByText("RTX 4090")).toBeInTheDocument();
  });

  it("renders quantity", () => {
    render(
      <OrderGroupProductItem
        name="Product"
        quantity={3}
        unitPrice={50}
      />
    );
    expect(screen.getByText("x3")).toBeInTheDocument();
  });

  it("calculates and displays total price", () => {
    render(
      <OrderGroupProductItem
        name="Product"
        quantity={2}
        unitPrice={150}
      />
    );
    expect(screen.getByText("$300.00")).toBeInTheDocument();
  });

  it("displays price when showPrice is true", () => {
    render(
      <OrderGroupProductItem
        name="Product"
        quantity={1}
        unitPrice={100}
        showPrice={true}
      />
    );
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("does not display price when showPrice is false", () => {
    render(
      <OrderGroupProductItem
        name="Product"
        quantity={1}
        unitPrice={100}
        showPrice={false}
      />
    );
    expect(screen.queryByText("$100.00")).not.toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(
      <OrderGroupProductItem
        name="Product"
        quantity={1}
        unitPrice={100}
        imageUrl="/product.jpg"
      />
    );
    expect(screen.getByAltText("Product")).toBeInTheDocument();
  });

  it("renders placeholder when imageUrl is not provided", () => {
    const { container } = render(
      <OrderGroupProductItem
        name="Product"
        quantity={1}
        unitPrice={100}
      />
    );
    expect(container.textContent).toContain("—");
  });
});
