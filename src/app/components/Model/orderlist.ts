import {OrderDetails} from './order-details';

export interface Orderlist {
   
  id: number;
  user_id: number;
  total_price: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  order_details: OrderDetails[];
}


