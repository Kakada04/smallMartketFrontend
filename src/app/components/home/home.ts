import { Component } from '@angular/core';
import {Banner} from  '../../reusablecomponents/banner/banner';
import {TopCategory} from  '../../reusablecomponents/top-category/top-category';
import { ProductCard } from "../../reusablecomponents/product-card/product-card";
import { Footer } from "../../reusablecomponents/footer/footer";
import { NewsLetter } from "../../reusablecomponents/news-letter/news-letter";
import { inject,ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data-service';
import {CategoryList} from '../Model/categoryList.model';
import { Product } from '../Model/product';
import { Cartitem } from '../Model/cartitem.model';

@Component({
  selector: 'app-home',
  imports: [Banner, TopCategory, ProductCard, Footer, NewsLetter,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
private dataService = inject(DataService)
private cdr = inject(ChangeDetectorRef)
private router = inject(Router)
topProductSaled:Partial<Product>[]=[];
newProductArrial:Partial<Product>[]=[]
categoryList:CategoryList[]=[];
 cartItems: Partial<Cartitem>[] = [];
ngOnInit(){
  this.loadCategory();
  this.loadMostProduct();
  this.loadNewProductArrival();
  this.loadCartItems()
}
loadCategory(){
  this.dataService.getCategory().subscribe({
    next:(res:any)=>{
      this.categoryList = res.data
      
      this.cdr.detectChanges()
    }
  })
}

selectedCategory(event:any){
  localStorage.setItem('categoryID',event)
  this.router.navigate(['/product']);
}

loadNewProductArrival(){
  this.dataService.getNewProductArrival().subscribe({
    next:(res:any)=>{
      this.newProductArrial = res.data
      
    }
  })
}

loadMostProduct(){
  this.dataService.getTopProductsaled().subscribe({
    next:(res:any)=>{
      
      this.topProductSaled = res.data
      console.log('dd'+this.topProductSaled)

      this.cdr.detectChanges();
    }
  })
}

loadCartItems(){
  this.dataService.getCartItems().subscribe({
    next:(res:any)=>{
      this.cartItems = res.data
    }
  })
}
  getCartItemForProduct(productId: any): Partial<Cartitem> | undefined {
    const cartItem = this.cartItems.find(item => item.product_id === productId);
    // console.log(`Cart item for product ${productId}:`, cartItem); // Debug
    return cartItem;
  }

  addToCart(event: { productId: any; quantity: number }) {
    const existingCartItem = this.cartItems.find(item => item.product_id === event.productId);
    // if (!existingCartItem) {
    //   // Add new cart item locally
    //   const product = this.products.find(p => p.id === event.productId);
    //   this.cartItems.push({
    //     product_id: event.productId,
    //     quantity: event.quantity,
    //     product: product
    //   });
    // }
    // Sync with backend
    const payload = {
      product_id: event.productId,  // Must be 'product_id' (snake_case)
      quantity: event.quantity as number   // Must be numeric
    };
    this.dataService.postCartItem(payload).subscribe({
      next: (res: any) => {
        console.log('Cart updated:', res);
        this.loadCartItems(); // Refresh from backend
        this.loadNewProductArrival();
        this.loadMostProduct();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error adding to cart:', err);
        // Revert local change if needed
        if (!existingCartItem) {
          this.cartItems = this.cartItems.filter(item => item.product_id !== event.productId);
        }
        this.cdr.detectChanges();
      }
    });
  }

  updateCart(event: { productId: any; quantity: number }) {
    const cartItem = this.cartItems.find(item => item.product_id === event.productId);
    if (cartItem) {
      cartItem.quantity = event.quantity;
    }
    if (event.quantity === 0) {
      this.dataService.deleteCartItem(event.productId).subscribe({
        next: (res: any) => {
          console.log('Cart item removed:', res);
          this.cartItems = this.cartItems.filter(item => item.product_id !== event.productId);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error removing cart item:', err);
        }
      });
    } else {
      const payload = { product_id: event.productId, quantity: event.quantity };
      this.dataService.updateCartItem(payload).subscribe({
        next: (res: any) => {
          console.log('Cart item updated:', res);
          this.loadCartItems();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error updating cart item:', err);
        }
      });
    }
  }
}
