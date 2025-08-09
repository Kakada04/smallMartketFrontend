import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../../components/Model/product';
import { Cartitem } from '../../components/Model/cartitem.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard implements OnChanges {
  @Input() product: Partial<Product> = {};
  @Input() cartItem: Partial<Cartitem> | undefined = undefined;
  @Output() addToCart = new EventEmitter<{ productId: any; quantity: number }>();
  @Output() updateCart = new EventEmitter<{ productId: any; quantity: any }>();
  choose: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cartItem'] || changes['product']) {
      this.cartOrProduct();
    }
  }

  cartOrProduct() {
    this.choose = !!this.cartItem && this.cartItem.product_id === this.product.id;
    // console.log(`Product ${this.product.id}: choose = ${this.choose}, cartItem =`, this.cartItem); // Debug
  }

  addToCartClicked() {
    // Create a temporary cartItem to switch to cart view immediately
    if (!localStorage.getItem('Token')) {
      window.location.href = '/login'; // or use Router.navigate()
      return;
    }
    this.cartItem = {
      product_id: this.product.id,
      quantity: 1,
      product: {
        ...(this.product as Product),
        id: this.product.id ?? 0 // Ensure id is a number, fallback to 0 if undefined
      } // Use product data for display
    };
    this.choose = true; // Switch to cart view
    this.addToCart.emit({ productId: this.product.id, quantity: 1 });
  }

  increasequantity() {
    if (this.cartItem) {
      this.cartItem.quantity = (this.cartItem.quantity || 0) + 1;
      this.updateCart.emit({ productId: this.cartItem.product_id, quantity: this.cartItem.quantity });
    }
  }

  decreasequantity() {
    if (this.cartItem && this.cartItem.quantity) {
      if (this.cartItem.quantity > 1) {
        this.cartItem.quantity--;
        this.updateCart.emit({ productId: this.cartItem.product_id, quantity: this.cartItem.quantity });
      } else if (this.cartItem.quantity === 1) {
        console.log('Removing item from cart', this.cartItem.product?.id);
        this.updateCart.emit({ productId: this.cartItem.product?.id, quantity: 0 });
        this.cartItem = undefined;
        this.choose = false;
      }
    }
  }


  viewDetail(product:any){
    if(product){
      localStorage.setItem('product_id_detail',product );
    }
  }
}