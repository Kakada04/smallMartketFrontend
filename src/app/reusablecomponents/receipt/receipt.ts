import { Component, Input } from '@angular/core';
import {NgFor} from '@angular/common';
import {DatePipe} from '@angular/common';

interface OrderDetail {
  product_name: string;
  quantity: number;
  price: number;
}

interface ReceiptI {
  total_price: number;
  tax: number;
  order_details: OrderDetail[];
}

@Component({
  selector: 'app-receipt',
  imports: [NgFor, DatePipe],
  templateUrl: './receipt.html',
  styleUrl: './receipt.css'
})
export class Receipt {
 @Input() receipt: ReceiptI = {
    total_price: 0,
    tax: 5,
    order_details: []
  };
  @Input() currentDate: Date = new Date; // Accept current date
  @Input() currentTime: Date = new Date; // Accept current time
  constructor() {
    console.log('Receipt Component Initialized with:', this.receipt);
  }
  // Getter for taxPricing
  get taxPricing(): number {
    return this.receipt.total_price * (this.receipt.tax / 100);
  }
  // Getter for total
  get total(): number {
    return this.receipt.total_price + this.taxPricing;
  }
}