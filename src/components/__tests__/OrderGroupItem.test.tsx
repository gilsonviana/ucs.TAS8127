import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import OrderGroupItem from "../OrderGroupItem";

const mockItems = [
  { productId: 1, name: "RTX 4090", quantity: 1, unitPrice: 1999.99 },
  { productId: 2, name: "CPU", quantity: 2, unitPrice: 500 },
];

describe("OrderGroupItem", () => {
  it("renders order id", () => {
    render(
      <OrderGroupItem
        orderId={123}
        date="2024-01-15"
        total={2999.99}
        items={mockItems}
      />
    );
    expect(screen.getByText(/order.*123/i)).toBeInTheDocument();
  });

  it("renders order date", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={100}
        items={mockItems}
      />
    );
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("renders all product items", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={100}
        items={mockItems}
      />
    );
    expect(screen.getByText("RTX 4090")).toBeInTheDocument();
    expect(screen.getByText("CPU")).toBeInTheDocument();
  });

  it("displays order total when showOrderTotal is true", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={2999.99}
        items={mockItems}
        showOrderTotal={true}
      />
    );
    expect(screen.getByText(/total.*2999.99/i)).toBeInTheDocument();
  });

  it("does not display order total when showOrderTotal is false", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={2999.99}
        items={mockItems}
        showOrderTotal={false}
      />
    );
    expect(screen.queryByText(/total.*2999.99/i)).not.toBeInTheDocument();
  });

  it("renders buy again button when onBuyAgain is provided", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={100}
        items={mockItems}
        onBuyAgain={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /buyAgain/i })).toBeInTheDocument();
  });

  it("does not render buy again button when onBuyAgain is not provided", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={100}
        items={mockItems}
      />
    );
    expect(screen.queryByRole("button", { name: /buyAgain/i })).not.toBeInTheDocument();
  });

  it("calls onBuyAgain when buy again button is clicked", async () => {
    const handleBuyAgain = vi.fn();
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={100}
        items={mockItems}
        onBuyAgain={handleBuyAgain}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /buyAgain/i }));
    expect(handleBuyAgain).toHaveBeenCalledOnce();
  });

  it("hides product prices when showProductPrices is false", () => {
    render(
      <OrderGroupItem
        orderId={1}
        date="2024-01-15"
        total={100}
        items={mockItems}
        showProductPrices={false}
      />
    );
    expect(screen.queryByText("$1999.99")).not.toBeInTheDocument();
  });
});
