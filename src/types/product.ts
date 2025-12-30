import { Review } from "./review";

export interface Product {
  _id: string;
  name: string;
  formula: string;
  casNumber: string;
  category: string;
  price: number;
  image: string;
  description: string;
  purity: string;
  molecularWeight: number;
  hazards: string[];
  inStock: boolean;
  stockLevel: number;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}
