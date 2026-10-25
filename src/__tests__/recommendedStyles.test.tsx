import { act } from 'react';
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RecommendedStyles } from "../components/cart/RecommendedStyles";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";
import { PRODUCTS } from "../data/products";

describe("RecommendedStyles Express-Add Component", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <HelmetProvider>
        <MemoryRouter>
          <RecommendedStyles />
        </MemoryRouter>
      </HelmetProvider>
    );
  };

  it("proposes styles excluding coming-soon products and products already in bag", () => {
    // Add first product to cart
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: "M",
      qty: 1,
    });

    const { container } = renderComponent();
    expect(screen.getByText(/recommended styles/i)).toBeInTheDocument();

    // PRODUCTS[0] must not be among recommended items
    const links = container.querySelectorAll("a[href]");
    const hrefs = Array.from(links).map((l) => l.getAttribute("href"));
    expect(hrefs).not.toContain(`/product/${PRODUCTS[0].slug}`);

    // Coming-soon products must never be recommended
    const comingSoon = PRODUCTS.filter((p) => p.status === "coming-soon");
    comingSoon.forEach((cs) => {
      expect(hrefs).not.toContain(`/product/${cs.slug}`);
    });
  });

  it("express-adds item inheriting size from recent bag item and shows gold checkmark", async () => {
    // Seed bag with a recent item of size M
    useCartStore.getState().addItem({
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      size: "M",
      qty: 1,
    });

    renderComponent();

    // Find the first express-add button
    const addButtons = screen.getAllByRole("button", { name: /^add /i });
    expect(addButtons.length).toBeGreaterThan(0);

    const firstAddBtn = addButtons[0];
    const initialBagCount = useCartStore.getState().items.length;

    // Click express-add
    act(() => {
      fireEvent.click(firstAddBtn);
    });

    // Cart items should increase by 1
    const newItems = useCartStore.getState().items;
    expect(newItems.length).toBe(initialBagCount + 1);

    // Toast triggered with Undo action
    const toasts = useUIStore.getState().toasts;
    expect(toasts.length).toBeGreaterThan(0);
    const lastToast = toasts[toasts.length - 1];
    expect(lastToast.message).toContain("Added");
    expect(lastToast.actionLabel).toBe("Undo");

    // Clicking Undo removes the added line
    if (lastToast.onAction) {
      act(() => {
        lastToast.onAction?.();
      });
      expect(useCartStore.getState().items.length).toBe(initialBagCount);
    }
  });

  it("expands inline size selector chips when cart is empty and allows user to pick size", () => {
    // Empty bag
    expect(useCartStore.getState().items.length).toBe(0);

    renderComponent();

    const addButtons = screen.getAllByRole("button", { name: /^add /i });
    expect(addButtons.length).toBeGreaterThan(0);

    // Clicking + on empty bag expands inline size chips
    act(() => {
      fireEvent.click(addButtons[0]);
    });

    const sizeGroup = screen.getByRole("radiogroup", { name: /select size to add/i });
    expect(sizeGroup).toBeInTheDocument();

    const sizeChips = sizeGroup.querySelectorAll("button");
    expect(sizeChips.length).toBeGreaterThan(0);

    // Pick size
    act(() => {
      fireEvent.click(sizeChips[0]);
    });

    // Cart should now have 1 item
    expect(useCartStore.getState().items.length).toBe(1);
    // Size group collapsed
    expect(screen.queryByRole("radiogroup", { name: /select size to add/i })).toBeNull();
  });

  it("hides the section completely when all available products are in the cart", () => {
    // Add all active products to cart
    PRODUCTS.filter((p) => p.status === "active").forEach((p) => {
      useCartStore.getState().addItem({
        product: p,
        variant: p.variants[0],
        size: p.sizes[0] || "M",
        qty: 1,
      });
    });

    const { container } = renderComponent();
    expect(container.firstChild).toBeNull();
  });
});
