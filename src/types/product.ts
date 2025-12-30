export interface Product {
  _id: string;
  name: string;
  formula: string;
  casNumber: string;
  category: string;
  price: number;
  quantity: string;
  image: string;
  description: string;
  purity: string;
  molecularWeight: number;
  hazards: string[];
  inStock: boolean;
  stockLevel: number;
}
