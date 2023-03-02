import { CategoryService } from './../shared/category.service';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../shared/category.model';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  categoryForm: FormGroup
  currentAction: string
  pageTitle: string
  submittingForm: boolean = false
  serverErrorMessages: string[] = null
  category: Category = new Category()

  constructor(
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.setCurrentAction()
    this.buildCategoryForm()
    this.loadCategory()
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  private setPageTitle() {
    if( this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria'
    } else {
      const categoryName = this.category.name || ''
      this.pageTitle = `Edição da Categoria: ${categoryName}`
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    })
  }

  private loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => this.categoryService.getById(Number(params.get('id')))),
        )
        .subscribe(
          (category) => {
            this.category = category
            this.categoryForm.patchValue(category)
          },
          (error) => alert('Ocorreu um erro, tente mais tarde!')
        )
    }
  }
}
