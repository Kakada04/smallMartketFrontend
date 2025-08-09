import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CartItem } from '../../reusablecomponents/cart-item/cart-item';
import { Receipt } from "../../reusablecomponents/receipt/receipt";
import { DataService as OrderService } from '../../services/data-service';
import { NgIf } from '@angular/common';
import { Cartitem } from '../Model/cartitem.model';
import { OrderCart } from '../Model/order-cart.model';

@Component({
  selector: 'app-cart',
  imports: [CartItem, Receipt,NgIf],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  products: Partial<Cartitem>[] = [];

  receipt: boolean = false;
  qrCode: string = '';
  orderId: number = 0;
  paymentStatus: string = 'pending';
  intervalId: any;
  orderCart: OrderCart[] = [];

   currentDate!: Date; // Use definite assignment assertion
  currentTime!: Date;  // Use definite assignment assertion



  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef) {
    this.loadCartItems();
    
    
  }
 ngAfterViewInit() {
    this.updateDateTime();
  }
  loadCartItems() {
    this.orderService.getCartItems().subscribe((cartItems: any) => {
      this.products = cartItems.data;
      console.log('Cart items:', this.products);
      this.cdr.detectChanges();
      this.calculateTotalPrice(); // Ensure the view updates with the new cart items
    });
  }

  updateQty(event: any) {
    this.calculateTotalPrice();
    this.orderService.updateCartItem(event).subscribe({
      next: (res: any) => {
        console.log('Cart item updated:', res);
        this.loadCartItems(); // Reload cart items after update
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        alert(error.error.message || 'An error occurred while updating the cart item. Please try again.');
      }
    });
  }

  deleteCart(event: any) {
    this.orderService.deleteCartItem(event).subscribe({
      next: (res: any) => {
        console.log('Cart item deleted:', res);
        this.loadCartItems(); // Reload cart items after deletion
      },
      error: (error) => {
        console.error('Error deleting cart item:', error);
        alert(error.error.message || 'An error occurred while deleting the cart item. Please try again.');
      }
    });
  }

 receiptData :any;
  total_price: number = 0; // Store the total price for further use
  calculateTotalPrice() {
    this.total_price = this.products.reduce((sum, item) => {
    const sell_price = item.product?.sell_price || 0;
    const quantity = item.quantity || 1;
    return sum + (sell_price * quantity);
  }, 0);
    console.log('Total Price:', this.total_price);
    this.cdr.detectChanges(); // Ensure the view updates with the new total price
    
  }
  updateDateTime() {
    const now = new Date();
    this.currentDate = now; // Store the current date
    this.currentTime = now; // Store the current time
    this.cdr.detectChanges(); // Trigger change detection
  }
  createReceiptData() {
    const receipt_details = this.products.map(item => ({
      product_name: item.product?.product_name || 'Unknown Product',
      quantity: item.quantity || 1,
      price: item.product?.sell_price || 0
    }));
    // Calculate total price based on the products
    const total_price = receipt_details.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
      total_price: total_price, // Calculate total price dynamically
      tax: 5,                   // Example tax percentage
      order_details: receipt_details // Use the dynamically created order details
    };
     // Store the total price for further use
  }

  proceedToCheckout() {
    // Calculate total price based on products in the cart
    const total_price = this.products.reduce((sum, item) => {
      const sell_price = item.product?.sell_price || 0;
      const quantity = item.quantity || 1;
      return sum + (sell_price * quantity);
    }, 0);

    // Create order details while ensuring product_id is defined
    const order_details = this.products
      .map(item => ({
        product_id: item.product_id as number,  // Type assertion since we filtered undefined
        quantity: item.quantity || 1,
        price: item.product?.sell_price || 0
      }))
      .filter(detail => detail.product_id !== undefined); // Filter out undefined product_ids
      this.receiptData = this.createReceiptData(); // Create receipt data
    // Log total price and order details for debugging
    console.log('Total Price:', total_price);
    console.log('Order Details:', order_details);
this.updateDateTime()
    // Create the order object
    const orderData = {
      total_price: total_price,
      order_details: order_details
    };

    // Call the order service to create the order
    this.orderService.createOrder(orderData).subscribe({
      next: (res: any) => {
        this.qrCode = 'data:image/png;base64,' + res.data.qr_code;
      
        console.log('QR Code:', this.qrCode);
        this.orderId = res.data.order.id;
        this.receipt = false;
        this.paymentStatus = 'pending';
        this.pollPaymentStatus();
        this.clearCart(); 
        this.cdr.detectChanges(); // Clear cart after order creation
         // Clear cart after order creation
      },
      error: (error) => {
        console.error('Order creation failed:', error);
        alert(error.error.message || 'Failed to create order');
      }
    });
  }


 clearCart() {
    // Assuming this.products contains the items in the cart
    const deleteRequests = this.products.map(item => 
        this.orderService.deleteCartItem(item.product_id as number).toPromise()
    );
    Promise.all(deleteRequests)
        .then(responses => {
            console.log('Cart cleared:', responses);
            this.products = []; // Clear local cart items
            this.cdr.detectChanges(); // Ensure the view updates
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            alert(error.error?.message || 'An error occurred while clearing the cart. Please try again.');
        });
}
  //   }).subscribe((res: any) => {
  //     this.qrCode = 'data:image/png;base64,' + res.data.qr_code;
  //     this.cdr.detectChanges(); // Ensure the view updates with the new QR code
  //     console.log('QR Code:', this.qrCode);
  //     this.orderId = res.data.order.id;
  //     this.receipt = false;
  //     this.paymentStatus = 'pending';
  //     this.pollPaymentStatus();

  //   });
  // }

  pollPaymentStatus() {
    this.intervalId = setInterval(() => {
      this.orderService.checkPaymentStatus(this.orderId).subscribe((res: any) => {
        this.paymentStatus = res.payment_status;
        if (res.payment_status === 'paid') {
          clearInterval(this.intervalId);
          this.receipt = true;
        }
      });
    }, 3000);
  }

  simulatePayment() {
    this.orderService.simulatePayment(this.orderId).subscribe(() => {
      console.log('Simulated payment sent');
      this.receipt = true;
      this.cdr.detectChanges(); // Ensure the view updates with the receipt
    });
  }
}
