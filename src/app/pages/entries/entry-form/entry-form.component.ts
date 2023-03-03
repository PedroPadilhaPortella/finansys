import { switchMap } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from '../shared/entry.model';
import toastr from 'toastr';

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

  constructor(
    private entryService: EntryService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.setCurrentAction()
    this.buildEntryForm()
    this.loadEntry()
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
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    })
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
          (error) => alert('Ocorreu um erro, tente mais tarde!')
        )
    }
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
