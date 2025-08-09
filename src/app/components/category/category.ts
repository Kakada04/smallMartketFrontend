import { Component,inject,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TopCategory } from "../../reusablecomponents/top-category/top-category";
import { DataService } from '../../services/data-service';
import {CategoryList} from '../Model/categoryList.model';

@Component({
  selector: 'app-category',
  imports: [ TopCategory],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {
private dataService = inject(DataService)
private cdr = inject(ChangeDetectorRef)
private router = inject(Router)
categoryList:CategoryList[]=[];
ngOnInit(){
  this.loadCategory()
}
loadCategory(){
  this.dataService.getCategory().subscribe({
    next:(res:any)=>{
      this.categoryList = res.data
      console.log(this.categoryList)
      this.cdr.detectChanges()
    }
  })
}

selectedCategory(event:any){
  localStorage.setItem('categoryID',event)
  this.router.navigate(['/product']);
}


}
