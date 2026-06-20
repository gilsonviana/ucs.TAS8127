import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ImageCard from "../ImageCard";

describe("ImageCard", () => {
  it("renders title text", () => {
    render(
      <ImageCard src="/test.jpg" alt="Test" title="Test Card" />
    );
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });

  it("renders image with correct src", () => {
    render(
      <ImageCard src="/gabinete-card.png" alt="Gabinete" title="Gabinetes" />
    );
    const image = screen.getByAltText("Gabinete");
    expect(image).toHaveAttribute("src", expect.stringContaining("gabinete"));
  });

  it("renders image with correct alt text", () => {
    render(
      <ImageCard src="/test.jpg" alt="GPU Card" title="Graphics Cards" />
    );
    expect(screen.getByAltText("GPU Card")).toBeInTheDocument();
  });

  it("has proper structure with flex layout", () => {
    const { container } = render(
      <ImageCard src="/test.jpg" alt="Test" title="Title" />
    );
    const card = container.querySelector("div");
    expect(card?.className).toContain("flex");
    expect(card?.className).toContain("flex-col");
  });

  it("displays text with truncation class", () => {
    const { container } = render(
      <ImageCard src="/test.jpg" alt="Test" title="Very Long Title" />
    );
    const text = container.querySelector("p");
    expect(text?.className).toContain("truncate");
  });
});
