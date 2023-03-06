import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
  imports: [
    SharedModule,
    CategoriesRoutingModule,
  ],
  declarations: [CategoryListComponent, CategoryFormComponent]
})
export class CategoriesModule { }
