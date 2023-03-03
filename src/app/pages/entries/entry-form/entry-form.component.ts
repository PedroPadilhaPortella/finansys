import { switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../shared/entry.model';
import toastr from 'toastr';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  entryForm: FormGroup
  currentAction: string
  pageTitle: string
  submittingForm: boolean = false
  serverErrorMessages: string[] = null
  entry: Entry = new Entry()
  categories: Array<Category>

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  languagePtBr = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  }

  constructor(
    private entryService: EntryService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.setCurrentAction()
    this.buildEntryForm()
    this.loadEntry()
    this.loadCategories()
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
      this.pageTitle = 'Cadastro de Novo Lançamento'
    } else {
      const entryName = this.entry.name || ''
      this.pageTitle = `Edição de Lançamento: ${entryName}`
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    })
  }

  getTypeOptions(): Array<any> {
    return Object.entries(Entry.types).map(([key, value]) => ({ key, value }))
  }

  private loadEntry() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => this.entryService.getById(Number(params.get('id')))),
        )
        .subscribe(
          (entry) => {
            this.entry = entry
            this.entryForm.patchValue(entry)
          },
          () => alert('Ocorreu um erro, tente mais tarde!')
        )
    }
  }

  private loadCategories() {
    this.categoryService.getAll()
    .subscribe(
      (categories) => this.categories = categories,
      () => alert('Ocorreu um erro, tente mais tarde!')
    )
  }

  submit() {
    if (this.entryForm.valid) {
      this.submittingForm = true;

      if (this.currentAction === 'new') {
        this.createEntry()
      } else {
        this.updateEntry()
      }
    }
    this.submittingForm = false;
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry, this.entryForm.value)
    this.entryService.create(entry)
      .subscribe(
        (entry: Entry) => this.actionForSuccess(entry),
        (error: any) => this.actionsForFailure(error)
      )
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry, this.entryForm.value)
    this.entryService.update(entry)
      .subscribe(
        (entry: Entry) => this.actionForSuccess(entry),
        (error: any) => this.actionsForFailure(error)
      )
  }

  private actionForSuccess(entry: Entry) {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl("entries", { skipLocationChange: true })
      .then(() => this.router.navigate(["entries", entry.id, "edit"]))
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
