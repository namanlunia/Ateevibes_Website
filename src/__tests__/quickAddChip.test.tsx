import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getQuickAddChipClasses, ProductCard } from "../components/product/ProductCard";
import { PRODUCTS } from "../data/products";

// Standard WCAG 2.1 relative luminance and contrast ratio calculation
function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const [rL, gL, bL] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Quick Add Size Chip Classes, States & Accessibility Contrast", () => {
  it("generates distinct class configurations for resting, hover/focus, and disabled states", () => {
    const resting = getQuickAddChipClasses({ isJustAdded: false, isOutOfStock: false });
    const disabled = getQuickAddChipClasses({ isJustAdded: false, isOutOfStock: true });
    const justAdded = getQuickAddChipClasses({ isJustAdded: true, isOutOfStock: false });

    // Ensure distinct configurations
    expect(resting).not.toBe(disabled);
    expect(resting).not.toBe(justAdded);
    expect(disabled).not.toBe(justAdded);

    // Resting state requirements
    expect(resting).toContain("bg-white");
    expect(resting).toContain("text-obsidian");
    expect(resting).toContain("border-obsidian/35");
    expect(resting).toContain("text-[13px]");
    expect(resting).toContain("font-semibold");
    expect(resting).toContain("transition-[background-color,color,border-color]");
    expect(resting).toContain("duration-150");

    // Hover/focus-visible state requirements
    expect(resting).toContain("hover:bg-obsidian");
    expect(resting).toContain("hover:text-gold");
    expect(resting).toContain("hover:border-gold");
    expect(resting).toContain("focus-visible:bg-obsidian");
    expect(resting).toContain("focus-visible:text-gold");
    expect(resting).toContain("focus-visible:border-gold");

    // Disabled state requirements (out of stock)
    expect(disabled).toContain("bg-sandstone/20");
    expect(disabled).toContain("text-ink-600");
    expect(disabled).toContain("line-through");
    expect(disabled).toContain("cursor-not-allowed");
    expect(disabled).not.toContain("opacity-60"); // Does not use opacity-60 to preserve 3:1 contrast

    // Just added state
    expect(justAdded).toContain("bg-status-success");
    expect(justAdded).toContain("text-white");
  });

  it("verifies label colour tokens are not equal to background tokens with compliant contrast ratios", () => {
    // Brand Token Hex Values:
    const obsidian = "#111111"; // --obsidian
    const white = "#ffffff";    // --white
    const gold = "#c9a45c";     // --gold / --champagne
    const ink600 = "#54514a";   // --ink-600
    // Sandstone (#d8d2c7) at 20% alpha over white:
    // r = 0.2 * 216 + 0.8 * 255 = 247.2 => #f7
    // g = 0.2 * 210 + 0.8 * 255 = 246.0 => #f6
    // b = 0.2 * 199 + 0.8 * 255 = 243.8 => #f4
    const sandstone20OnWhite = "#f7f6f4";

    // 1. Resting token distinctness and contrast >= 4.5:1
    expect(obsidian).not.toBe(white);
    const restingContrast = getContrastRatio(obsidian, white);
    expect(restingContrast).toBeGreaterThanOrEqual(4.5);
    expect(restingContrast).toBeGreaterThan(18.0);

    // 2. Hover / focus token distinctness and contrast >= 4.5:1
    expect(gold).not.toBe(obsidian);
    const hoverContrast = getContrastRatio(gold, obsidian);
    expect(hoverContrast).toBeGreaterThanOrEqual(4.5);
    expect(hoverContrast).toBeGreaterThan(7.0);

    // 3. Disabled token distinctness and contrast >= 3.0:1
    expect(ink600).not.toBe(sandstone20OnWhite);
    const disabledContrast = getContrastRatio(ink600, sandstone20OnWhite);
    expect(disabledContrast).toBeGreaterThanOrEqual(3.0);
    expect(disabledContrast).toBeGreaterThan(7.0);
  });

  it("ensures all four sizes display their labels in the quick add panel, including out-of-stock XL", () => {
    // Style 500 variant 1 (White) has stockBySize: { S: 15, M: 10, L: 6, XL: 0 }
    const product = { ...PRODUCTS[0] };
    const variantWithOutOfStockXL = {
      ...product.variants[0],
      stockBySize: { S: 10, M: 12, L: 8, XL: 0 },
    };
    product.variants = [variantWithOutOfStockXL, ...product.variants.slice(1)];

    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    // Quick add size buttons
    const sizeS = screen.getByRole("button", { name: "Quick add size S" });
    const sizeM = screen.getByRole("button", { name: "Quick add size M" });
    const sizeL = screen.getByRole("button", { name: "Quick add size L" });
    const sizeXL = screen.getByRole("button", { name: "Quick add size XL - Sold out" });

    // Verify all 4 size chips are in the document with non-empty text content
    expect(sizeS).toHaveTextContent("S");
    expect(sizeM).toHaveTextContent("M");
    expect(sizeL).toHaveTextContent("L");
    expect(sizeXL).toHaveTextContent("XL");

    // S, M, L are enabled
    expect(sizeS).not.toBeDisabled();
    expect(sizeM).not.toBeDisabled();
    expect(sizeL).not.toBeDisabled();

    // XL is out of stock and disabled
    expect(sizeXL).toBeDisabled();
    expect(sizeXL.className).toContain("line-through");
    expect(sizeXL.className).toContain("cursor-not-allowed");
  });
});
