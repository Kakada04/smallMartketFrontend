import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Product } from '../../components/Model/product';
import { RouterLink } from '@angular/router';
import { Cartitem } from '../../components/Model/cartitem.model';
// import { JsonPipe } from '@angular/common';



@Component({
  selector: 'app-produccard-details',
  imports: [RouterLink],
  templateUrl: './produccard-details.html',
  styleUrl: './produccard-details.css'
})
export class ProduccardDetails {
 private cdr = inject(ChangeDetectorRef);

  @Input() product: Partial<Product> = {};
  @Input() product_cart: Partial<Cartitem>={};
  @Output() addTocart = new EventEmitter<{ product_id: number; quantity: number }>();
  @Output() UpdateCart = new EventEmitter<{ product_id: number; quantity: number }>();
  choose:boolean = false
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product_cart']) {
      this.cdr.detectChanges();
     this.choose = !!changes['product_cart'].currentValue.id;
    }
  }

  addtoCart() {
    this.choose = true
    if (!localStorage.getItem('Token')) {
      window.location.href = '/login';
      return;
    }
    const cartItem = {
      product_id: this.product.id as number,
      quantity: 1
    };
    this.addTocart.emit(cartItem);
    
    this.cdr.detectChanges();
  }

  increasequantity() {
  if (this.product_cart) {
      this.product_cart.quantity = (this.product_cart.quantity || 0) + 1;
      this.UpdateCart.emit({ product_id: this.product_cart.product_id as number, quantity: this.product_cart.quantity });
    }
  }

  decreasequantity() {
    if (this.product_cart && this.product_cart.quantity) {
      if (this.product_cart.quantity > 1) {
        this.product_cart.quantity--;
        this.UpdateCart.emit({ product_id: this.product_cart.product_id as number, quantity: this.product_cart.quantity });
      } else if (this.product_cart.quantity === 1) {
        console.log('Removing item from cart', this.product_cart.product?.id);
        this.UpdateCart.emit({ product_id: this.product_cart.product?.id as number, quantity: 0 });
        this.product_cart = {};
        this.choose = false;
      }
    }
  }
}