import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingContent from "@/components/LandingContent";

vi.mock("motion-components", () => ({}));

describe("LandingContent", () => {
  it("renders the editorial journey", () => {
    render(<LandingContent />);
    expect(screen.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet. Sour. Earthy." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Freshly brewed. Ready when the batch is." })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows the verified process and preparation facts", () => {
    render(<LandingContent />);
    expect(screen.getByText("Fresh ingredients")).toBeInTheDocument();
    expect(screen.getByText("Small batches")).toBeInTheDocument();
    expect(screen.getByText("Brewed weekly")).toBeInTheDocument();
  });

  it("uses one primary verified order action", () => {
    render(<LandingContent />);
    const link = screen.getByRole("link", { name: "Order this week on Instagram" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/sinomaramalang/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("removes unverified contact and health copy", () => {
    const { container } = render(<LandingContent />);
    expect(container.textContent).not.toMatch(/WhatsApp|wa\.me|antioxid|vitamin/i);
    expect(container.textContent).not.toMatch(/anti-inflammatory|digestive|glycemic/i);
  });

  it("uses approved Motion Components primitives and renders the CTA", () => {
    const { container } = render(<LandingContent />);
    expect(container.querySelectorAll("motion-reveal").length).toBeGreaterThan(0);
    expect(container.querySelectorAll("motion-stagger").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("link", { name: "Order this week on Instagram" })).toBeVisible();
  });
});
