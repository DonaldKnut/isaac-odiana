export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  coverUrl: string | null;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};
