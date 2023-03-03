import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMaskModule } from 'angular-imask';
import { CalendarModule } from 'primeng/calendar';
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryListComponent } from './entry-list/entry-list.component';

@NgModule({
  imports: [
    CommonModule,
    EntriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    IMaskModule,
  ],
  declarations: [EntryListComponent, EntryFormComponent]
})
export class EntriesModule { }
