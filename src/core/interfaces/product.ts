import type { category } from "./category";

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: category;
  images: string[];
  creationAt: string;
  updatedAt: string;
}
