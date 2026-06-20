import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PaymentRadio from "../PaymentRadio";

describe("PaymentRadio", () => {
  it("renders all payment method options", () => {
    render(
      <PaymentRadio value="pix" onChange={vi.fn()} />
    );
    expect(screen.getByRole("radio", { name: /pix/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /bankSlip/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /creditCard/i })).toBeInTheDocument();
  });

  it("checks the selected payment method", () => {
    render(
      <PaymentRadio value="pix" onChange={vi.fn()} />
    );
    const pixRadio = screen.getByRole("radio", { name: /pix/i });
    expect(pixRadio).toBeChecked();
  });

  it("calls onChange when pix is selected", async () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <PaymentRadio value="bank_slip" onChange={handleChange} />
    );
    await userEvent.click(screen.getByRole("radio", { name: /pix/i }));
    expect(handleChange).toHaveBeenCalledWith("pix");
  });

  it("calls onChange when bank_slip is selected", async () => {
    const handleChange = vi.fn();
    render(
      <PaymentRadio value="pix" onChange={handleChange} />
    );
    await userEvent.click(screen.getByRole("radio", { name: /bankSlip/i }));
    expect(handleChange).toHaveBeenCalledWith("bank_slip");
  });

  it("calls onChange when credit_card is selected", async () => {
    const handleChange = vi.fn();
    render(
      <PaymentRadio value="pix" onChange={handleChange} />
    );
    await userEvent.click(screen.getByRole("radio", { name: /creditCard/i }));
    expect(handleChange).toHaveBeenCalledWith("credit_card");
  });

  it("only one payment method is checked at a time", async () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <PaymentRadio value="pix" onChange={handleChange} />
    );

    await userEvent.click(screen.getByRole("radio", { name: /bankSlip/i }));

    rerender(
      <PaymentRadio value="bank_slip" onChange={handleChange} />
    );

    expect(screen.getByRole("radio", { name: /bankSlip/i })).toBeChecked();
    expect(screen.getByRole("radio", { name: /pix/i })).not.toBeChecked();
  });

  it("renders fieldset for form semantics", () => {
    const { container } = render(
      <PaymentRadio value="pix" onChange={vi.fn()} />
    );
    expect(container.querySelector("fieldset")).toBeInTheDocument();
  });
});
