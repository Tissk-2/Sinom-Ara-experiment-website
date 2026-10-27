import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingContent from "@/components/LandingContent";

vi.mock("motion-components", () => ({}));

describe("LandingContent", () => {
  it("renders the editorial journey", () => {
    render(<LandingContent />);
    expect(screen.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Three ingredients, held in balance." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet. Sour. Earthy." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Freshly brewed. Ready when the batch is." })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("lists the three verified ingredients as a list", () => {
    render(<LandingContent />);
    for (const name of ["Young tamarind leaves", "Fresh turmeric", "Palm sugar"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(
      within(screen.getByRole("region", { name: "Three ingredients, held in balance." }))
        .getAllByRole("listitem"),
    ).toHaveLength(3);
  });

  it("shows the verified process and preparation facts", () => {
    render(<LandingContent />);
    expect(screen.getByText("Fresh ingredients")).toBeInTheDocument();
    expect(screen.getByText("Small batches")).toBeInTheDocument();
    expect(screen.getByText("Brewed weekly")).toBeInTheDocument();
  });

  it("uses one primary verified order action via WhatsApp", () => {
    render(<LandingContent />);
    const link = screen.getByRole("link", { name: "Pesan Batch Minggu Ini" });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/62\d+\?text=/));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("offers a reseller enquiry through the same WhatsApp channel", () => {
    render(<LandingContent />);
    const link = screen.getByRole("link", { name: "Tanya Program Reseller" });
    expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/62\d+\?text=/));
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("reseller");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps Instagram as a secondary verified destination", () => {
    render(<LandingContent />);
    const link = screen.getByRole("link", { name: "Lihat Sinom ARA di Instagram" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/sinomaramalang/");
  });

  it("makes each product card a single WhatsApp order link", () => {
    render(<LandingContent />);
    const cards = screen.getAllByRole("link", { name: /Pesan via WhatsApp/ });
    expect(cards).toHaveLength(3);
    for (const link of cards) {
      expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/62\d+\?text=/));
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("removes unsupported health copy", () => {
    const { container } = render(<LandingContent />);
    expect(container.textContent).not.toMatch(/antioxid|vitamin|anti-inflammatory|digestive|glycemic/i);
  });

  it("uses approved Motion Components primitives and renders the CTA", () => {
    const { container } = render(<LandingContent />);
    expect(container.querySelectorAll("motion-reveal").length).toBeGreaterThan(0);
    expect(container.querySelectorAll("motion-stagger").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("link", { name: "Pesan Batch Minggu Ini" })).toBeVisible();
  });
});
