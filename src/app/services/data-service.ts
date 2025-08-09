import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://smallmarketbackendlaravel-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  loginUser(credentials: { gmail: string; password: string }) {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  registerUser(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  getProducts() {
    return this.http.get(`${this.baseUrl}/products`);
  }
  getProductsById(productId:any){
    return this.http.get(`${this.baseUrl}/products/productid/${productId}`)
  }
  createOrder(orderData: any) {
    return this.http.post(`${this.baseUrl}/orderlist`, orderData);
  }
getUserCartByProductId(productId:any){
   return this.http.get(`${this.baseUrl}/cart/usercard/${productId}`)
}
  checkPaymentStatus(orderId: number) {
    return this.http.get(`${this.baseUrl}/checkstatus/${orderId}`);
  }

  simulatePayment(orderId: number) {
    return this.http.post(`${this.baseUrl}/simulatepayment`, { order_id: orderId });
  }

  getCartItems():Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usercart`);
  }
  postCartItem(cartitem: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart`, cartitem);
  }
  updateCartItem(cartitem: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/cartupdate`, cartitem);
  }
  deleteCartItem(productId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/cartdelete/${productId}`);
}
    getCategory():Observable<any>{
  return this.http.get<any>(this.baseUrl + '/category')}


  getProductByCategory(categoryID:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/category/${categoryID}/products`)
  }

  getProductByName(product_name:string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/product/productname/${product_name}`)
  }

  getNewProductArrival():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/new-arrivals?limit=10&days=7`)
  }
  getTopProductsaled():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/top-products?period=today&limit=5`)
  }
}
