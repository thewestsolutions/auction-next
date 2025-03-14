export type Category = {
  id: number;
  icon: string;
  title: string;
  slug: string;
};

export type Item = {
  id: number;
  title: string;
  price_retail: number;
  price_bid: number;
  category_id: number;
  image_cover: string;
  expires_at: string;
  images: string[];
  condition: string;
};

export type BidHistory = {
  id: number;
  item_id: number;
  user_id: string;
  amount: number;
};
