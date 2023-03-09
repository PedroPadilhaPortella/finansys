import { HttpClient } from "@angular/common/http";
import { BaseResourceModel } from "../models/base-resource.model";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injector } from "@angular/core";

export abstract class BaseResourceService<T extends BaseResourceModel>   {

  protected httpClient: HttpClient;

  constructor(
    protected apiPath: string, 
    protected injector: Injector,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.httpClient = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this.httpClient.get(this.apiPath)
      .pipe(
        map(this.jsonDataToResources.bind(this)),
        catchError(this.handleError)
      )
  }

  getById(id: number): Observable<T> {
    return this.httpClient.get(`${this.apiPath}/${id}`)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      )
  }

  create(resource: T): Observable<T> {
    return this.httpClient.post(this.apiPath, resource)
      .pipe(
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      )
  }

  update(resource: T): Observable<T> {
    return this.httpClient.put(`${this.apiPath}/${resource.id}`, resource)
      .pipe(
        map(() => resource),
        catchError(this.handleError)
      )
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiPath}/${id}`)
      .pipe(
        map(() => null),
        catchError(this.handleError)
      )
  }

  /* Protected Methods */
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    console.log('Erro na Requisição --> ', error)
    return throwError(error)
  }
}