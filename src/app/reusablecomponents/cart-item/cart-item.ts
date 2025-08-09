import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { Cartitem } from '../../components/Model/cartitem.model';

@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.css'
})
export class CartItem {
  @Input() product: Partial<Cartitem> = {};
  @Output() QuantityChange:EventEmitter<any> = new EventEmitter<void>();
  @Output() productDelete:EventEmitter<any> = new EventEmitter<void>();

  productUpdate:any = {
    product_id: 0,
    quantity: 0
  }



  constructor() {}

  increasQty() {
    const product_id = Number(this.product.product_id);
    const quantity = Number(this.product.quantity ?? 0) + 1;
    const payload = { product_id, quantity };
    console.log('Increase payload:', payload);
    this.QuantityChange.emit(payload);

  }

  decreasQty() {
    const product_id = Number(this.product.product_id);
    const quantity = Math.max(1, Number(this.product.quantity ?? 1) - 1);
    const payload = { product_id, quantity };
    console.log('Decrease payload:', payload);
    this.QuantityChange.emit(payload);
  }

  deleteCart(product_id: any) {
    this.productDelete.emit(product_id);
  }
}