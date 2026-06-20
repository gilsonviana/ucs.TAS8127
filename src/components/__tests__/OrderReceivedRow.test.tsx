import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import OrderReceivedRow from "../OrderReceivedRow";

describe("OrderReceivedRow", () => {
  it("renders order id", () => {
    render(
      <OrderReceivedRow
        orderId={42}
        date="2024-01-15"
        customerName="John Doe"
        total={199.99}
      />
    );
    expect(screen.getByText(/orderNumber.*42/i)).toBeInTheDocument();
  });

  it("renders order date", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={100}
      />
    );
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("renders customer name", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="Jane Smith"
        total={100}
      />
    );
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders formatted total", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={199.99}
      />
    );
    expect(screen.getByText("$199.99")).toBeInTheDocument();
  });

  it("displays pending status", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={100}
        status="pending"
      />
    );
    expect(screen.getByText("statusPending")).toBeInTheDocument();
  });

  it("displays fulfilled status", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={100}
        status="fulfilled"
      />
    );
    expect(screen.getByText("statusFulfilled")).toBeInTheDocument();
  });

  it("renders fulfill button when status is pending", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={100}
        status="pending"
        onStatusChange={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /fulfill/i })).toBeInTheDocument();
  });

  it("does not render fulfill button when status is fulfilled", () => {
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={100}
        status="fulfilled"
        onStatusChange={vi.fn()}
      />
    );
    expect(screen.queryByRole("button", { name: /fulfill/i })).not.toBeInTheDocument();
  });

  it("calls onStatusChange when fulfill button is clicked", async () => {
    const handleStatusChange = vi.fn();
    render(
      <OrderReceivedRow
        orderId={1}
        date="2024-01-15"
        customerName="John Doe"
        total={100}
        status="pending"
        onStatusChange={handleStatusChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /fulfill/i }));
    expect(handleStatusChange).toHaveBeenCalledWith("fulfilled");
  });
});
