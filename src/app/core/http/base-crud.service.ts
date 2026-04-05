import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<T>{

  lista$ = new BehaviorSubject<T[]>([]);

  constructor(
    protected http: HttpClient,
    protected endpoint: string
  ) { }

  obtenerLista(): Observable<T[]> {
    return this.lista$.asObservable();
  }
  cargar(): Observable<T[]> {
    return this.http.get<T[]>(this.endpoint).pipe(
      tap(lista => this.lista$.next(lista))
    );
  }
  crear(entidad: T) {
    return this.http.post<T>(this.endpoint, entidad).pipe(
      switchMap( () => this.cargar() )
    );  
  }
  // si en algun momento genera problema, actualizar el tipo de dato que es id
  actualizar(id: string | number, entidad: T){
    return this.http.put<T>(`${this.endpoint}/${id}`, entidad).pipe(
      switchMap(() => this.cargar())
    );
  }
  eliminar(id: number){
    return this.http.delete(`${this.endpoint}/${id}`).pipe(
      switchMap(() => this.cargar())
    );
  }

}
