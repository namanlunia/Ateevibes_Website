export type SleeveType = 'half' | 'full';
export type NeckType = 'round' | 'polo';
type ProductStatus = 'active' | 'coming-soon';
type BadgeType = 'New' | 'Best Seller' | 'Coming Soon' | 'Low Stock';
export type SizeType = 'S' | 'M' | 'L' | 'XL';

export interface Variant {
  id: string;
  colourName: string;
  colourSlug: string;
  hex: string;
  patternImage?: string;
  images: string[];
  stockBySize: Record<SizeType | string, number>;
}

export interface Product {
  id: string;
  slug: string;
  pno: string;
  name: string;
  category: string;
  categoryName: string;
  subCategory: string;
  subCategoryName: string;
  tags: string[];
  sleeve: SleeveType;
  neck: NeckType;
  fabric: string;
  printType: string;
  mrp: number;
  priceConfirmed: boolean;
  status: ProductStatus;
  badges: BadgeType[];
  highlights: string[];
  description: string;
  variants: Variant[];
  sizes: SizeType[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  popularity: number;
  catalogPoster: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  size: SizeType | string;
  qty: number;
  product?: Product;
  variant?: Variant;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus = 'placed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  grandTotal: number;
  promoCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  estimatedDeliveryDate: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isSample: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  savedAddresses: Address[];
}
