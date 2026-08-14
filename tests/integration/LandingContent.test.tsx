import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingContent from "@/components/LandingContent";

vi.mock("motion-components", () => ({}));

describe("LandingContent", () => {
  it("renders the five-part editorial journey", () => {
    render(<LandingContent />);
    expect(screen.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Three ingredients, held in balance." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet. Sour. Earthy." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Freshly brewed. Ready when the batch is." })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows the verified ingredients and preparation facts", () => {
    render(<LandingContent />);
    for (const name of ["Young tamarind leaves", "Fresh turmeric", "Palm sugar"]) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }
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

  it("uses all approved Motion Components primitives without hiding the CTA", () => {
    const { container } = render(<LandingContent />);
    expect(container.querySelectorAll("motion-reveal").length).toBeGreaterThan(0);
    expect(container.querySelectorAll("motion-stagger").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelectorAll("motion-hover").length).toBeGreaterThan(0);
    expect(container.querySelector("motion-press")).toBeInTheDocument();
    expect(container.querySelector("motion-magnetic")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Order this week on Instagram" })).toBeVisible();
  });
});
