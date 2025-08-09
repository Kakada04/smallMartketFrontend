import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProduccardDetails } from "../../reusablecomponents/produccard-details/produccard-details";
import { Product } from '../Model/product';
import { DataService } from '../../services/data-service';
import { Cartitem } from '../Model/cartitem.model';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [ProduccardDetails],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail {
  product: Partial<Product> = {}
  productCart: Partial<Cartitem> = {}
  product_id_detail: any;



  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef)

  ngOnInit() {
    const product_id = localStorage.getItem('product_id_detail');
    this.product_id_detail = product_id || '';
    this.loadData();
  }

  loadData() {
    const isLoggedIn = localStorage.getItem('Token'); 
    
    forkJoin({
      product: this.dataService.getProductsById(this.product_id_detail),
      cart: isLoggedIn ? this.dataService.getUserCartByProductId(this.product_id_detail): of({ data: [] }) // safe fallback
    }).subscribe({
      next: (results: { product: any; cart: any }) => {
        this.product = results.product?.data ?? {};
        this.productCart = results.cart?.data ?? {};

        console.log('✅ Loaded product and cart:', this.product, this.productCart);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error loading product/cart:', err);
      }
    });
  }

  addtoCart(event: any) {
    this.dataService.postCartItem(event).subscribe({
      next: (res: any) => {
        console.log(res)
        this.loadData()
        this.cdr.detectChanges()
      }
    })
  }

  updateCart(event: {
    product_id: number;
    quantity: number;
  }) {


    if (event.quantity === 0) {
      this.dataService.deleteCartItem(event.product_id).subscribe({
        next: (res: any) => {
          console.log(res)
          this.loadData()
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error removing cart item:', err);
        }
      });
    } else {
      const payload = { product_id: event.product_id, quantity: event.quantity };
      this.dataService.updateCartItem(payload).subscribe({
        next: (res: any) => {
           console.log(res)
           this.loadData()
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error updating cart item:', err);
        }
      });
    }
  }

}
