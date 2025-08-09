import{ Product } from './product';

export interface Cartitem {
    id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;

}
