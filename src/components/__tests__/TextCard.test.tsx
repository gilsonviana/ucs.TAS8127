import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TextCard from "../TextCard";

describe("TextCard", () => {
  it("renders text content", () => {
    render(<TextCard text="Hello World" />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders with rounded corners", () => {
    const { container } = render(<TextCard text="Test" />);
    const div = container.querySelector("div");
    expect(div?.className).toContain("rounded-xl");
  });

  it("renders with shadow", () => {
    const { container } = render(<TextCard text="Test" />);
    const div = container.querySelector("div");
    expect(div?.className).toContain("shadow-md");
  });

  it("renders with correct height", () => {
    const { container } = render(<TextCard text="Test" />);
    const div = container.querySelector("div");
    expect(div?.className).toContain("h-48");
  });

  it("renders text in white color", () => {
    const { container } = render(<TextCard text="Test" />);
    const p = container.querySelector("p");
    expect(p?.className).toContain("text-white");
  });

  it("applies custom className", () => {
    const { container } = render(
      <TextCard text="Test" className="custom-class" />
    );
    const div = container.querySelector("div");
    expect(div?.className).toContain("custom-class");
  });

  it("centers content", () => {
    const { container } = render(<TextCard text="Test" />);
    const div = container.querySelector("div");
    expect(div?.className).toContain("flex");
    expect(div?.className).toContain("items-center");
    expect(div?.className).toContain("justify-center");
  });
});
