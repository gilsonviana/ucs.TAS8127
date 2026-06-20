import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  it("renders an input with placeholder", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("calls onChange with new value when typing", async () => {
    const handler = vi.fn();
    render(<SearchBar value="" onChange={handler} />);
    await userEvent.type(screen.getByRole("searchbox"), "gpu");
    expect(handler).toHaveBeenCalled();
  });

  it("displays the controlled value", () => {
    render(<SearchBar value="rtx" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox")).toHaveValue("rtx");
  });
});
