import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries'

  constructor(
    private httpClient: HttpClient,
    private categoryService: CategoryService
  ) { }

  getAll(): Observable<Entry[]> {
    return this.httpClient.get(this.apiPath)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToEntries)
      )
  }

  getById(id: number): Observable<Entry> {
    return this.httpClient.get(`${this.apiPath}/${id}`)
      .pipe(
        catchError(this.handleError),
        map(this.jsonDataToEntry)
      )
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap((category) => {
          entry.category = category
          return this.httpClient.post(this.apiPath, entry)
            .pipe(
              catchError(this.handleError),
              map(this.jsonDataToEntry)
            )
        })
      )

  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId)
      .pipe(
        flatMap((category) => {
          entry.category = category
          return this.httpClient.put(`${this.apiPath}/${entry.id}`, entry)
            .pipe(
              catchError(this.handleError),
              map(() => entry)
            )
        })
      )
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiPath}/${id}`)
      .pipe(
        catchError(this.handleError),
        map(() => null)
      )
  }

  /* Private Methods */
  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = []
    jsonData.forEach(el => {
      entries.push(Object.assign(new Entry(), el))
    })

    return entries
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData)
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na Requisi????o --> ', error)
    return throwError(error)
  }
}
