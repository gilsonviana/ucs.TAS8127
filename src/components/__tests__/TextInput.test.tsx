import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TextInput from "../TextInput";

describe("TextInput", () => {
  it("renders with a label", () => {
    render(<TextInput label="Email" id="email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(<TextInput error="This field is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("This field is required");
  });

  it("applies error border class when error is provided", () => {
    render(<TextInput error="oops" data-testid="inp" />);
    expect(screen.getByTestId("inp").className).toContain("border-error");
  });
});
