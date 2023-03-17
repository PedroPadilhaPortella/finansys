import { AfterContentChecked, Injector, OnInit, Directive } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = []

  constructor(
    private resourceService: BaseResourceService<T>
  ) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      (resources) => this.resources = resources.sort((a, b) => b.id - a.id),
      (error) => alert('Erro ao carregar lista!'))
  }

  removeResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir esse item?')

    if (mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element !== resource),
        () => alert('Erro ao remover item!')
      )
    }
  }
}
