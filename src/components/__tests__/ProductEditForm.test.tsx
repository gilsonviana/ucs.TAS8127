import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProductEditForm from "../ProductEditForm";

const mockCategories = [
  { id: 1, name: "GPUs" },
  { id: 2, name: "CPUs" },
];

describe("ProductEditForm", () => {
  it("renders form fields", () => {
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
  });

  it("renders category select with options", () => {
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={vi.fn()}
      />
    );
    const select = screen.getByDisplayValue(/none/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "GPUs" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "CPUs" })).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("renders cancel button when onCancel is provided", () => {
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const handleCancel = vi.fn();
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it("populates fields with default values", () => {
    render(
      <ProductEditForm
        defaultValues={{
          name: "RTX 4090",
          price: 1999.99,
          stock: 5,
        }}
        categories={mockCategories}
        onSubmit={vi.fn()}
      />
    );
    expect(screen.getByDisplayValue("RTX 4090")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1999.99")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
  });

  it("calls onSubmit with form data", async () => {
    const handleSubmit = vi.fn();
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={handleSubmit}
      />
    );

    await userEvent.type(screen.getByLabelText(/^name/i), "GPU");
    await userEvent.type(screen.getByLabelText(/price/i), "500");
    await userEvent.type(screen.getByLabelText(/stock/i), "10");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
      const callArgs = handleSubmit.mock.calls[0][0];
      expect(callArgs.name).toBe("GPU");
      expect(callArgs.price).toBe(500);
      expect(callArgs.stock).toBe(10);
    });
  });

  it("disables submit button when loading", () => {
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={vi.fn()}
        loading={true}
      />
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("allows empty description", async () => {
    const handleSubmit = vi.fn();
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={handleSubmit}
      />
    );

    await userEvent.type(screen.getByLabelText(/^name/i), "GPU");
    await userEvent.type(screen.getByLabelText(/price/i), "500");
    await userEvent.type(screen.getByLabelText(/stock/i), "10");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it("allows empty category", async () => {
    const handleSubmit = vi.fn();
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={handleSubmit}
      />
    );

    await userEvent.type(screen.getByLabelText(/^name/i), "GPU");
    await userEvent.type(screen.getByLabelText(/price/i), "500");
    await userEvent.type(screen.getByLabelText(/stock/i), "10");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  it("validates required fields", async () => {
    const handleSubmit = vi.fn();
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={handleSubmit}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  it("allows positive price values", async () => {
    const handleSubmit = vi.fn();
    render(
      <ProductEditForm
        categories={mockCategories}
        onSubmit={handleSubmit}
      />
    );

    await userEvent.type(screen.getByLabelText(/^name/i), "GPU");
    await userEvent.type(screen.getByLabelText(/price/i), "99.99");
    await userEvent.type(screen.getByLabelText(/stock/i), "5");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
