import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout'
import { Home } from './components/home/home';
import { Product } from './components/product/product';
import { OrderList } from './components/order-list/order-list';
import { Cart } from './components/cart/cart';
import { User } from './components/user/user'
import { PageNotFound } from './page-not-found/page-not-found';
import { Login } from './components/login/login';
import { Category } from './components/category/category';
import {Contact} from './components/contact/contact';
import { Favorite } from './components/favorite/favorite';
import { About } from './components/about/about';
import { LoginSignup } from './components/login-signup/login-signup';
import {authGuardGuard} from './security/guard/auth-guard-guard'
import { ProductDetail } from './components/product-detail/product-detail';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path:'login',
        component:LoginSignup
    },
    {
        path:'signup',
        component:LoginSignup
    },
    {
        path: '',
        component: Layout,
        
        children: [
            {
                path: 'home',
                component: Home,
            }, {
                path: 'product',
                component: Product
            }, {
                canActivate: [authGuardGuard],
                path: 'order',
                component: OrderList
            }, {
                 canActivate: [authGuardGuard],
                path: 'cart',
                component: Cart
            },
            {
                canActivate: [authGuardGuard],
                path: 'user',
                component: User
            },{
                path:'category',
                component:Category
            },{
                path:'contact',
                component:Contact
            },{
                canActivate: [authGuardGuard],
                path:'favorite',
                component:Favorite
            },{
                path:'about',
                component:About
            },{
                path:'productdetail',
                component:ProductDetail
            }

        ]
    },
    
    { path: '**', component: PageNotFound }




];
