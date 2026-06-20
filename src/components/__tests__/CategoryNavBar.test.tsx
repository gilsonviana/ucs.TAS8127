import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CategoryNavBar from "../CategoryNavBar";

const mockCategories = [
  { id: 1, name: "GPUs" },
  { id: 2, name: "CPUs" },
  { id: 3, name: "RAM" },
];

describe("CategoryNavBar", () => {
  it("renders all category with 'all' text", () => {
    render(<CategoryNavBar categories={mockCategories} />);
    expect(screen.getByText("all")).toBeInTheDocument();
  });

  it("renders all categories", () => {
    render(<CategoryNavBar categories={mockCategories} />);
    expect(screen.getByText("GPUs")).toBeInTheDocument();
    expect(screen.getByText("CPUs")).toBeInTheDocument();
    expect(screen.getByText("RAM")).toBeInTheDocument();
  });

  it("highlights selected category", () => {
    const { container } = render(
      <CategoryNavBar categories={mockCategories} selected={1} />
    );
    const gpuButton = screen.getByRole("button", { name: "GPUs" });
    expect(gpuButton).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights 'all' when selected is null", () => {
    render(<CategoryNavBar categories={mockCategories} selected={null} />);
    const allButton = screen.getAllByRole("button")[0];
    expect(allButton).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onSelect when category is clicked in button mode", async () => {
    const handleSelect = vi.fn();
    render(
      <CategoryNavBar
        categories={mockCategories}
        selected={null}
        onSelect={handleSelect}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "GPUs" }));
    expect(handleSelect).toHaveBeenCalledWith(1);
  });

  it("calls onSelect with null when 'all' is clicked", async () => {
    const handleSelect = vi.fn();
    render(
      <CategoryNavBar
        categories={mockCategories}
        selected={1}
        onSelect={handleSelect}
      />
    );
    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it("renders as links when navigateToCategories is true", () => {
    render(
      <CategoryNavBar
        categories={mockCategories}
        navigateToCategories={true}
      />
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("renders correct href for product links", () => {
    render(
      <CategoryNavBar
        categories={mockCategories}
        navigateToCategories={true}
      />
    );
    const link = screen.getByRole("link", { name: "GPUs" });
    expect(link).toHaveAttribute("href", "/produtos?category=1");
  });

  it("renders all products link", () => {
    render(
      <CategoryNavBar
        categories={mockCategories}
        navigateToCategories={true}
      />
    );
    const allLink = screen.getByRole("link", { name: "all" });
    expect(allLink).toHaveAttribute("href", "/produtos");
  });

  it("renders with aria-label for nav", () => {
    const { container } = render(
      <CategoryNavBar categories={mockCategories} />
    );
    const nav = container.querySelector("nav");
    expect(nav).toHaveAttribute("aria-label", "title");
  });
});
