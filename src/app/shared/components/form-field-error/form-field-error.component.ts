import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
  <p class="text-danger">
    {{ errorMessage }}
  </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: UntypedFormControl;
  @Input('field-name') fieldName: string;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if (this.hasAnyError()) {
      return this.getErrorMessage();
    } else {
      return null
    }
  }

  private hasAnyError() {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl.errors.required) {
      return `Campo ${this.fieldName} Obrigatório`;

    } else if (this.formControl.errors.minlength) {
      const requiredLength = this.formControl.errors.minlength.requiredLength
      return `Campo ${this.fieldName} ter no mínimo ${requiredLength} caracteres`;

    } else if (this.formControl.errors.maxlength) {
      const requiredLength = this.formControl.errors.maxlength.requiredLength
      return `Campo ${this.fieldName} ter no máximo ${requiredLength} caracteres`;

    } else if (this.formControl.errors.email) {
      return `Formato de Email Inválido`;
    }
  }
}
