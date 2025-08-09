import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ProductCard } from '../../reusablecomponents/product-card/product-card';
import { Footer } from '../../reusablecomponents/footer/footer';
import { DataService } from '../../services/data-service';
import { Cartitem } from '../Model/cartitem.model';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [ProductCard, Footer],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class Product {
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);
  cartItems: Partial<Cartitem>[] = [];
  products: any[] = [];
  category: any[] = [];
  isLoading: boolean = true;
  categoryID: number = 0;

  async ngOnInit() {
    this.loadData();
    const cateID = Number(localStorage.getItem('categoryID'));
    this.categoryID = cateID ? (cateID) : 0;
    if (localStorage.getItem('categoryID')) {
      console.log(this.categoryID)
      try {
        await this.categoryShort(this.categoryID);
        localStorage.removeItem('categoryID');
      } catch (error) {
        console.error('Error:', error);
        // Handle error if needed
      }
    }
  }

  loadData() {
    const isLoggedIn = localStorage.getItem('Token'); // or use a proper AuthService

    forkJoin({
      products: this.dataService.getProducts(),
      categories: this.dataService.getCategory(),
      cartItems: isLoggedIn ? this.dataService.getCartItems() : of({ data: [] }) // safe fallback
    }).subscribe({
      next: (results: { products: any; categories: any; cartItems: any }) => {
        this.products = results.products.data || [];
        console.log('Results from forkJoin:', results);
        console.log('Loaded products:', this.products);
        this.category = results.categories.data || [];
        this.cartItems = results.cartItems.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading data:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCartItemForProduct(productId: any): Partial<Cartitem> | undefined {
    const cartItem = this.cartItems.find(item => item.product_id === productId);
    // console.log(`Cart item for product ${productId}:`, cartItem); // Debug
    return cartItem;
  }

  addToCart(event: { productId: any; quantity: number }) {
    const existingCartItem = this.cartItems.find(item => item.product_id === event.productId);
    if (!existingCartItem) {
      // Add new cart item locally
      const product = this.products.find(p => p.id === event.productId);
      this.cartItems.push({
        product_id: event.productId,
        quantity: event.quantity,
        product: product
      });
    }
    // Sync with backend
    const payload = {
      product_id: event.productId,  // Must be 'product_id' (snake_case)
      quantity: event.quantity as number   // Must be numeric
    };
    this.dataService.postCartItem(payload).subscribe({
      next: (res: any) => {
        console.log('Cart updated:', res);
        this.loadCartItems(); // Refresh from backend
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



  categoryShort(filter: number) {
    this.dataService.getProductByCategory(filter).subscribe({
      next: (res: any) => {
        this.products = res.data
        this.cdr.detectChanges();
      }
    })
  }
  allProduct() {
    this.dataService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res.data
        this.cdr.detectChanges();
      }
    })
  }
  // Reusable loadCartItems without Promise
  private loadCartItems() {
    this.dataService.getCartItems().subscribe({
      next: (res: any) => {
        this.cartItems = res.data || [];
        // console.log('Cart items loaded:', this.cartItems); // Debug
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading cart items:', err);
      }
    });
  }
}