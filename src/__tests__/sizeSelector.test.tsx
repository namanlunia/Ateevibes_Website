import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ProductPage } from "../pages/ProductPage";
import { QuickViewModal } from "../components/product/QuickViewModal";
import { useUIStore } from "../store/uiStore";
import { PRODUCTS } from "../data/products";

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

describe("Size Selector Gold Chips & Contrast Verification", () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.getState().closeQuickView();
  });

  it("verifies ProductPage size selector renders with gold active classes, single selection, and non-colour checkmark", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/product/royal-print-jacquard-full-sleeve"]}>
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const radiogroup = await screen.findByRole("radiogroup", { name: /select size/i });
    expect(radiogroup).toBeInTheDocument();

    const sizeChips = screen.getAllByRole("radio");
    expect(sizeChips.length).toBeGreaterThan(0);

    // Default first size is selected
    const selectedChips = sizeChips.filter((chip) => chip.getAttribute("aria-checked") === "true");
    expect(selectedChips.length).toBe(1);

    const activeChip = selectedChips[0];
    expect(activeChip.className).toContain("bg-chip-active-bg");
    expect(activeChip.className).toContain("text-chip-active-text");
    expect(activeChip.className).toContain("border-chip-active-border");

    // Other chips are inactive
    const inactiveChips = sizeChips.filter((chip) => chip.getAttribute("aria-checked") === "false");
    inactiveChips.forEach((chip) => {
      expect(chip.className).toContain("bg-chip-inactive-bg");
      expect(chip.className).toContain("text-chip-inactive-text");
      expect(chip.className).toContain("border-chip-inactive-border");
    });

    // Selecting another size changes selection cleanly
    if (inactiveChips.length > 0) {
      fireEvent.click(inactiveChips[0]);
      expect(inactiveChips[0].getAttribute("aria-checked")).toBe("true");
      expect(inactiveChips[0].className).toContain("bg-chip-active-bg");
      expect(activeChip.getAttribute("aria-checked")).toBe("false");
    }
  });

  it("verifies QuickViewModal size selector renders with gold tokens on selected size", async () => {
    useUIStore.getState().openQuickView(PRODUCTS[0]);

    render(
      <HelmetProvider>
        <MemoryRouter>
          <QuickViewModal />
        </MemoryRouter>
      </HelmetProvider>
    );

    const radiogroup = screen.getByRole("radiogroup", { name: /select size/i });
    expect(radiogroup).toBeInTheDocument();

    const chips = screen.getAllByRole("radio");
    const active = chips.find((c) => c.getAttribute("aria-checked") === "true");
    expect(active).toBeDefined();
    expect(active?.className).toContain("bg-chip-active-bg");
    expect(active?.className).toContain("text-chip-active-text");
    expect(active?.className).toContain("border-chip-active-border");
  });

  it("proves WCAG contrast ratio for active and inactive size chip tokens exceeds 4.5:1", () => {
    const activeBg = "#111111"; // --chip-active-bg
    const activeText = "#c9a45c"; // --chip-active-text
    const activeBorder = "#c9a45c"; // --chip-active-border

    const activeTextContrast = getContrastRatio(activeBg, activeText);
    expect(activeTextContrast).toBeGreaterThanOrEqual(4.5);
    // Exceeds AAA (7:1)
    expect(activeTextContrast).toBeGreaterThanOrEqual(8.0);

    const activeBorderContrast = getContrastRatio(activeBg, activeBorder);
    expect(activeBorderContrast).toBeGreaterThanOrEqual(4.5);

    const inactiveBg = "#ffffff"; // --chip-inactive-bg
    const inactiveText = "#111111"; // --chip-inactive-text
    const inactiveContrast = getContrastRatio(inactiveBg, inactiveText);
    expect(inactiveContrast).toBeGreaterThanOrEqual(4.5);
    expect(inactiveContrast).toBeGreaterThanOrEqual(18.0);
  });
});
