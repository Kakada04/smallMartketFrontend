import { OrderDetailCart } from "./order-detail-cart.model";

export interface OrderCart {
    total_price: number;
    order_details: OrderDetailCart[];
}
