import { Product, Variant, SizeType, SleeveType, NeckType } from "../types";
import { getVariantHex } from "../data/colours";

export function normalizeServerProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const p = raw as Record<string, unknown>;
  if (typeof p.id !== "string" || typeof p.name !== "string" || typeof p.slug !== "string") {
    return null;
  }

  const id = p.id;
  const slug = p.slug;
  const pno = typeof p.pno === "string" ? p.pno : "";
  const name = p.name;
  const category = typeof p.category === "string" ? p.category : "";
  const categoryName = typeof p.categoryName === "string" ? p.categoryName : category;
  const subCategory = typeof p.subCategory === "string" ? p.subCategory : "";
  const subCategoryName = typeof p.subCategoryName === "string" ? p.subCategoryName : subCategory;
  const sleeve: SleeveType = p.sleeve === "full" ? "full" : "half";
  const neck: NeckType = p.neck === "polo" ? "polo" : "round";
  const fabric = typeof p.fabric === "string" ? p.fabric : "Matty";
  const printType = typeof p.printType === "string" ? p.printType : "Solid / Weave";
  const mrp = typeof p.mrp === "number" ? p.mrp : Number(p.mrp) || 999;
  const priceConfirmed = typeof p.priceConfirmed === "boolean" ? p.priceConfirmed : true;
  const status = p.status === "coming-soon" ? "coming-soon" : "active";
  const badges = Array.isArray(p.badges) ? (p.badges as Product["badges"]) : [];
  const highlights = Array.isArray(p.highlights) ? (p.highlights as string[]) : [];
  const description = typeof p.description === "string" ? p.description : "";
  const rating = typeof p.rating === "number" ? p.rating : Number(p.rating) || 4.8;
  const reviewCount = typeof p.reviewCount === "number" ? p.reviewCount : Number(p.reviewCount) || 0;
  const popularity = typeof p.popularity === "number" ? p.popularity : Number(p.popularity) || 80;
  const catalogPoster = typeof p.catalogPoster === "string" && p.catalogPoster ? p.catalogPoster : "";
  const createdAt = typeof p.createdAt === "string" ? p.createdAt : new Date().toISOString();
  const tags = Array.isArray(p.tags) ? (p.tags as string[]) : [category, subCategory].filter(Boolean);

  const rawVariants = Array.isArray(p.variants) ? p.variants : [];
  const variants: Variant[] = rawVariants.map((vObj, idx) => {
    const v = (vObj || {}) as Record<string, unknown>;
    const vId = typeof v.id === "string" ? v.id : `var-${id}-${idx + 1}`;
    const colourName = typeof v.colourName === "string" ? v.colourName : "Signature";
    const colourSlug = typeof v.colourSlug === "string" ? v.colourSlug : "signature";
    const rawHex = typeof v.hex === "string" ? v.hex : undefined;
    const hex = getVariantHex({ hex: rawHex, colourName, colourSlug });
    const patternImage = typeof v.patternImage === "string" ? v.patternImage : undefined;
    const images = Array.isArray(v.images) && v.images.length > 0
      ? (v.images as string[])
      : [typeof v.image === "string" ? v.image : "/brand/tshirt-silhouette.svg"];

    let stockBySize: Record<string, number> = { S: 10, M: 12, L: 8, XL: 4 };
    if (v.stockBySize && typeof v.stockBySize === "object") {
      stockBySize = v.stockBySize as Record<string, number>;
    } else if (Array.isArray(v.stockLevels)) {
      stockBySize = {};
      for (const sl of v.stockLevels) {
        if (sl && typeof sl === "object") {
          const sObj = sl as Record<string, unknown>;
          if (typeof sObj.size === "string") {
            stockBySize[sObj.size] =
              typeof sObj.quantity === "number" ? sObj.quantity : Number(sObj.quantity) || 0;
          }
        }
      }
    }

    return {
      id: vId,
      colourName,
      colourSlug,
      hex,
      patternImage,
      images,
      stockBySize,
    };
  });

  const sizes: SizeType[] = ["S", "M", "L", "XL"];

  return {
    id,
    slug,
    pno,
    name,
    category,
    categoryName,
    subCategory,
    subCategoryName,
    tags,
    sleeve,
    neck,
    fabric,
    printType,
    mrp,
    priceConfirmed,
    status,
    badges,
    highlights,
    description,
    variants,
    sizes,
    rating,
    reviewCount,
    createdAt,
    popularity,
    catalogPoster,
  };
}
