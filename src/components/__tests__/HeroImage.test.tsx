import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeroImage from "../HeroImage";

describe("HeroImage", () => {
  it("renders image", () => {
    render(
      <HeroImage src="/hero-banner.png" alt="Hero Banner" />
    );
    expect(screen.getByAltText("Hero Banner")).toBeInTheDocument();
  });

  it("uses provided src", () => {
    render(
      <HeroImage src="/custom-hero.jpg" alt="Custom" />
    );
    const image = screen.getByAltText("Custom");
    expect(image).toHaveAttribute("src", expect.stringContaining("hero"));
  });

  it("renders with correct alt text", () => {
    render(
      <HeroImage src="/test.jpg" alt="My Hero" />
    );
    expect(screen.getByAltText("My Hero")).toBeInTheDocument();
  });

  it("has responsive height classes", () => {
    const { container } = render(
      <HeroImage src="/test.jpg" alt="Test" />
    );
    const div = container.querySelector("div");
    expect(div?.className).toContain("h-64");
    expect(div?.className).toContain("md:h-96");
  });

  it("has full width", () => {
    const { container } = render(
      <HeroImage src="/test.jpg" alt="Test" />
    );
    const div = container.querySelector("div");
    expect(div?.className).toContain("w-full");
  });

  it("has overflow hidden for proper image cropping", () => {
    const { container } = render(
      <HeroImage src="/test.jpg" alt="Test" />
    );
    const div = container.querySelector("div");
    expect(div?.className).toContain("overflow-hidden");
  });
});
