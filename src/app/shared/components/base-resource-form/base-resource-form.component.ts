import { AfterContentChecked, Injector, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel>
  implements OnInit, AfterContentChecked {

  resourceForm: FormGroup;
  currentAction: string;
  pageTitle: string;
  submittingForm: boolean = false;
  serverErrorMessages: string[] = null;

  protected formBuilder: FormBuilder;
  protected route: ActivatedRoute;
  protected router: Router;

  constructor(
    protected injector: Injector,
    protected resourceService: BaseResourceService<T>,
    public resource: T,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.route = this.injector.get(ActivatedRoute)
    this.router = this.injector.get(Router)
    this.formBuilder = this.injector.get(FormBuilder)
  }

  ngOnInit() {
    this.setCurrentAction()
    this.buildResourceForm()
    this.loadResource()
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  protected setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  protected abstract buildResourceForm(): void;

  protected setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle()
    } else {
      this.pageTitle = this.editionPageTitle()
    }
  }

  protected creationPageTitle = (): string => "Novo";

  protected editionPageTitle = (): string => "Edição";

  protected loadResource() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params) => this.resourceService.getById(Number(params.get('id')))),
        )
        .subscribe(
          (resource) => {
            this.resource = resource
            this.resourceForm.patchValue(resource)
          },
          (error) => alert('Ocorreu um erro, tente mais tarde!')
        )
    }
  }

  submit() {
    if (this.resourceForm.valid) {
      this.submittingForm = true;

      if (this.currentAction === 'new') {
        this.createResource()
      } else {
        this.updateResource()
      }
    }
    this.submittingForm = false;
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
    this.resourceService.create(resource)
      .subscribe(
        (resource: T) => this.actionForSuccess(resource),
        (error: any) => this.actionsForFailure(error)
      )
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value)
    this.resourceService.update(resource)
      .subscribe(
        (resource: T) => this.actionForSuccess(resource),
        (error: any) => this.actionsForFailure(error)
      )
  }

  protected actionForSuccess(resource: T) {
    toastr.success("Solicitação processada com sucesso!");
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() => this.router.navigate([baseComponentPath, resource.id, "edit"]))
  }

  protected actionsForFailure(error: any) {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente novamente mais tarde."]
  }
}
