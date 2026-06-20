import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CategorySidebar from "../CategorySidebar";

const mockCategories = [
  { id: 1, name: "GPUs" },
  { id: 2, name: "CPUs" },
  { id: 3, name: "Motherboards" },
];

describe("CategorySidebar", () => {
  it("renders title", () => {
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText("title")).toBeInTheDocument();
  });

  it("renders 'all' option", () => {
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "all" })).toBeInTheDocument();
  });

  it("renders all categories", () => {
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "GPUs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CPUs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Motherboards" })).toBeInTheDocument();
  });

  it("marks 'all' as pressed when selected is null", () => {
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "all" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("marks category as pressed when selected", () => {
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={1}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "GPUs" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("calls onSelect with null when 'all' is clicked", async () => {
    const handleSelect = vi.fn();
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={1}
        onSelect={handleSelect}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "all" }));
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it("calls onSelect with category id when category is clicked", async () => {
    const handleSelect = vi.fn();
    render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={handleSelect}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "CPUs" }));
    expect(handleSelect).toHaveBeenCalledWith(2);
  });

  it("has aside element with aria-label", () => {
    const { container } = render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={vi.fn()}
      />
    );
    const aside = container.querySelector("aside");
    expect(aside).toHaveAttribute("aria-label", "title");
  });

  it("renders list with role", () => {
    const { container } = render(
      <CategorySidebar
        categories={mockCategories}
        selected={null}
        onSelect={vi.fn()}
      />
    );
    const list = container.querySelector("ul");
    expect(list).toHaveAttribute("role", "list");
  });
});
