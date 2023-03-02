import { CategoryService } from './../shared/category.service';
import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../shared/category.model';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

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
    if (this.currentAction == 'new') {
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

  submit() {
    if (this.categoryForm.valid) {
      this.submittingForm = true;

      if (this.currentAction === 'new') {
        this.createCategory()
      } else {
        this.updateCategory()
      }
    }
    this.submittingForm = false;
  }

  private createCategory() {
    const category: Category = Object.assign(new Category, this.categoryForm.value)
    this.categoryService.create(category)
      .subscribe(
        (category: Category) => this.actionForSuccess(category),
        (error: any) => this.actionsForFailure(error)
      )
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category, this.categoryForm.value)
    this.categoryService.update(category)
      .subscribe(
        (category: Category) => this.actionForSuccess(category),
        (error: any) => this.actionsForFailure(error)
      )
  }

  private actionForSuccess(category: Category) {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl("categories", { skipLocationChange: true })
      .then(() => this.router.navigate(["categories", category.id, "edit"]))
  }

  private actionsForFailure(error: any) {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente novamente mais tarde."]
  }
}
