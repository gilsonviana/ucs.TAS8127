import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/hooks/useCatalog", () => ({
  useCategories: () => [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ],
}));

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

vi.mock("@/context/CartStore", () => ({
  useCartStore: vi.fn(() => () => 0),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

// Lazy load HomePage after mocks are set up
let HomePage: typeof import("../page").default;

describe("HomePage", () => {
  beforeEach(async () => {
    const module = await import("../page");
    HomePage = module.default;
  });

  it("renders navigation bar", () => {
    render(<HomePage />);
    expect(screen.getByRole("button", { name: /cart/i })).toBeInTheDocument();
  });

  it("renders category navigation", () => {
    render(<HomePage />);
    const navs = screen.getAllByRole("navigation");
    expect(navs.length).toBeGreaterThan(0);
  });

  it("renders hero image", () => {
    render(<HomePage />);
    const img = screen.getByAltText("Hero");
    expect(img).toBeInTheDocument();
  });

  it("renders product category cards", () => {
    render(<HomePage />);
    expect(screen.getByAltText("Gabinete")).toBeInTheDocument();
    expect(screen.getByAltText("Headphone")).toBeInTheDocument();
  });

  it("renders page title", () => {
    render(<HomePage />);
    expect(screen.getByText(/confira nossas produtos/i)).toBeInTheDocument();
  });
});
