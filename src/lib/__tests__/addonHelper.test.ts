import { describe, it, expect } from "vitest";
import { pickAddonVariantAndSize } from "../addonHelper";
import { Product, CartItem } from "../../types";
import { PRODUCTS } from "../../data/products";

const baseVariant = PRODUCTS[0].variants[0];
const mockVariant = {
  ...baseVariant,
  stockBySize: { S: 5, M: 8, L: 0, XL: 2 },
};

const mockProduct: Product = {
  ...PRODUCTS[0],
  status: "active",
  variants: [mockVariant],
  sizes: ["S", "M", "L", "XL"],
};

describe("pickAddonVariantAndSize helper", () => {
  it("inherits size from the most recently added cart item if in stock", () => {
    const cartItems: CartItem[] = [
      {
        id: "item-old",
        productId: "prod-old",
        variantId: "var-old",
        size: "S",
        qty: 1,
      },
      {
        id: "item-recent",
        productId: "prod-recent",
        variantId: "var-recent",
        size: "M",
        qty: 1,
      },
    ];

    const result = pickAddonVariantAndSize(cartItems, mockProduct);
    expect(result).not.toBeNull();
    expect(result?.size).toBe("M");
  });

  it("returns null size when recent cart item size is out of stock in candidate product variant", () => {
    const cartItems: CartItem[] = [
      {
        id: "item-recent",
        productId: "prod-recent",
        variantId: "var-recent",
        size: "L", // stock is 0 in mockVariant
        qty: 1,
      },
    ];

    const result = pickAddonVariantAndSize(cartItems, mockProduct);
    expect(result).not.toBeNull();
    expect(result?.size).toBeNull(); // asks user to expand inline size chips
  });

  it("returns null size when cart is empty so user must pick size", () => {
    const result = pickAddonVariantAndSize([], mockProduct);
    expect(result).not.toBeNull();
    expect(result?.size).toBeNull();
  });

  it("returns null when product is entirely out of stock across all variants", () => {
    const outOfStockProduct: Product = {
      ...mockProduct,
      variants: [
        {
          ...mockVariant,
          stockBySize: { S: 0, M: 0, L: 0, XL: 0 },
        },
      ],
    };

    const result = pickAddonVariantAndSize([], outOfStockProduct);
    expect(result).toBeNull();
  });

  it("returns null when product status is coming-soon", () => {
    const comingSoonProduct: Product = {
      ...mockProduct,
      status: "coming-soon",
    };

    const result = pickAddonVariantAndSize([], comingSoonProduct);
    expect(result).toBeNull();
  });
});
