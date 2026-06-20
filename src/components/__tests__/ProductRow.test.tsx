import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProductRow from "../ProductRow";

describe("ProductRow", () => {
  it("renders product name", () => {
    render(
      <ProductRow
        id={1}
        name="RTX 4090"
        price={1999.99}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("RTX 4090")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(
      <ProductRow
        id={1}
        name="Product"
        price={299.99}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("$299.99")).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(
      <ProductRow
        id={1}
        name="Product"
        price={100}
        imageUrl="/product.jpg"
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const image = screen.getByAltText("Product");
    expect(image).toBeInTheDocument();
  });

  it("renders placeholder when imageUrl is not provided", () => {
    const { container } = render(
      <ProductRow
        id={1}
        name="Product"
        price={100}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(container.textContent).toContain("—");
  });

  it("calls onEdit with product id when edit button is clicked", async () => {
    const handleEdit = vi.fn();
    render(
      <ProductRow
        id={42}
        name="Product"
        price={100}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(42);
  });

  it("calls onDelete with product id when delete button is clicked", async () => {
    const handleDelete = vi.fn();
    render(
      <ProductRow
        id={42}
        name="Product"
        price={100}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith(42);
  });

  it("renders edit and delete buttons", () => {
    render(
      <ProductRow
        id={1}
        name="Product"
        price={100}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("renders with flex layout for horizontal alignment", () => {
    const { container } = render(
      <ProductRow
        id={1}
        name="Product"
        price={100}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const row = container.querySelector("div");
    expect(row?.className).toContain("flex");
    expect(row?.className).toContain("items-center");
  });
});
