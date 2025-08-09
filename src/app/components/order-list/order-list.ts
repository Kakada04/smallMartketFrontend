import { HttpClient } from '@angular/common/http';
import { Component, inject,ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {Orderlist} from '../Model/orderlist';
import {NgClass} from '@angular/common';


@Component({
  selector: 'app-order-list',
  imports: [CurrencyPipe,NgClass],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList {

  private baseUrl :string  = 'https://smallmarketbackendlaravel-production.up.railway.app/api';
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
   orders: Orderlist[] = [];


  ngOnInit() {
    this.loadOrders();
  }


  loadOrders() {
     // Ensure change detection runs before loading orders
    this.http.get(`${this.baseUrl}/userorder`).subscribe({
      next: (res: any) => {
        this.orders = res.data;
        console.log('Orders loaded:', this.orders);
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading orders:', err)
    });
  }
trackByOrderId(index: number, order: Orderlist): number {
  return order.id;
}

trackByDetailId(index: number, detail: any): number {
  return detail.id;
}

payAgain(orderId: number) {
  this.http.post(`${this.baseUrl}/simulatepayment`, { order_id: orderId }).subscribe({
    next: (res: any) => {
      console.log('Payment simulated for order:', orderId);
      alert('Payment simulated successfully!');
    },
    error: err => {
      console.error('Error simulating payment:', err);
      alert('Failed to simulate payment. Please try again.');
    }
  });
}

}
