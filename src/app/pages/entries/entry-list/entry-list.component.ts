import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  public entries: Entry[]

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      (entries) => this.entries = entries.sort((a, b) => b.id - a.id),
      (error) => alert('Erro ao carregar lista de categorias!'))
  }

  removeEntry(category: Entry) {
    const mustDelete = confirm('Deseja realmente excluir esse item?')

    if (mustDelete) {
      this.entryService.delete(category.id).subscribe(
        () => this.entries = this.entries.filter(element => element !== category),
        () => alert('Erro ao carregar remover lançamento!')
      )
    }
  }
}
