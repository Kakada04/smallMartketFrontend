import { Component,ChangeDetectorRef,inject } from '@angular/core';
import { RouterOutlet,RouterLink,RouterLinkActive } from "@angular/router";
import {NgClass,NgIf} from'@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DataService } from '../../services/data-service';
import { Product } from '../Model/product';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkActive, RouterLink, NgClass,NgIf,FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  products:Product[]=[];
  product_name:string=''
  gmail: string = "kakada@gmail.com";
  bg: string = "home";        // desktop nav
  mobileBg: string = "home";  // mobile bottom nav
  sidebar: boolean = false;
  searchBoard: boolean = false;
  private cdr = inject(ChangeDetectorRef);
  private dataService = inject(DataService);
  constructor(private router: Router) {}
isLoggedIn: boolean = false;

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('Token');
    // Subscribe to navigation events
    console.log('Layout component initialized');
    this.cdr.detectChanges(); // Ensure change detection runs after initialization
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setNavHighlight(event.urlAfterRedirects);
      });

    // Trigger on initial load (especially after login redirect)
    this.setNavHighlight(this.router.url);
  }

  private setNavHighlight(url: string) {
    // Desktop nav
    this.cdr.detectChanges(); 
    if (url.includes('/home')) this.bg = 'home';
    else if (url.includes('/product')) this.bg = 'product';
    else if (url.includes('/order')) this.bg = 'order';
    else if (url.includes('/cart')) this.bg = 'cart';
    else if (url.includes('/user')) this.bg = 'user';
    else if (url.includes('/category')) this.bg = 'category';
    else if (url.includes('/about')) this.bg = 'about';
    else if (url.includes('/favorite')) this.bg = 'favorite';

    // Mobile nav
    if (url.includes('/home')) this.mobileBg = 'home';
    else if (url.includes('/product')) this.mobileBg = 'product';
    else if (url.includes('/order')) this.mobileBg = 'order';
    else if (url.includes('/cart')) this.mobileBg = 'cart';
    else if (url.includes('/user') || url.includes('/contact')) this.mobileBg = 'user';
  }

  checkInputStatus(event: any) {
    const inputValue = event.target.value;
    this.searchBoard = inputValue.length > 0;
    
    if(event.key =="Backspace"){
    console.log(event.key)
    this.products =[]
    }
  }



  searchProduct(product_name:string){
    this.dataService.getProductByName(product_name).subscribe({
      next:(res:any)=>{
        this.products = res.data
        console.log(this.products)
      }
    })
  }


  viewDetail(product:any){
    debugger
    if(product){
      localStorage.setItem('product_id_detail',product );
      this.searchBoard = false;
      this.product_name=''
      this.cdr.detectChanges()
      this.router.navigateByUrl('/productdetail')
    }
  }
}