import { Component,EventEmitter,Input, Output } from '@angular/core';

import { CategoryList } from '../../components/Model/categoryList.model';

@Component({
  selector: 'app-top-category',
  imports: [],
  templateUrl: './top-category.html',
  styleUrl: './top-category.css'
})
export class TopCategory {
@Input() category : Partial<CategoryList>={};
@Output() chooseCategory : EventEmitter<void> = new EventEmitter<void>();

choosed(category_id:any){
  this.chooseCategory.emit(category_id);
}

} 
