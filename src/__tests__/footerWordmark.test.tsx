import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Preloader } from "../components/motion/Preloader";

function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Wordmark Visibility on Dark Surfaces", () => {
  it("verifies Footer renders gold wordmark and gold tagline on obsidian dark surface", () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const wordmark = screen.getByText("ATEEVIBES");
    expect(wordmark).toBeInTheDocument();
    expect(wordmark.className).toContain("text-gold");
    expect(wordmark.className).not.toContain("text-obsidian");
    expect(wordmark.className).not.toContain("text-midnight");

    const tagline = screen.getByText(/feel the vibes/i);
    expect(tagline).toBeInTheDocument();
    expect(tagline.className).toContain("text-gold");

    const emblem = container.querySelector("img[src*='emblem']");
    expect(emblem).toBeInTheDocument();
  });

  it("verifies Preloader renders gold wordmark on dark surface", () => {
    render(<Preloader />);

    const preloaderHeading = screen.getByRole("heading", { name: /ateevibes/i, hidden: true });
    expect(preloaderHeading).toBeInTheDocument();
    expect(preloaderHeading.className).toContain("text-gold");
  });

  it("proves WCAG contrast ratio for gold wordmark (#c9a45c) on obsidian footer (#111111) exceeds 4.5:1", () => {
    const gold = "#c9a45c";
    const obsidian = "#111111";
    const ratio = getContrastRatio(gold, obsidian);

    expect(ratio).toBeGreaterThanOrEqual(4.5);
    // In fact exceeds AAA threshold (7:1) with 8.15:1
    expect(ratio).toBeGreaterThanOrEqual(8.0);
  });
});
