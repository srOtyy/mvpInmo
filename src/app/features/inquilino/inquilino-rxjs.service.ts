import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IInquilino } from './inquilino.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InquilinoRxjsService {
  URL = 'http://localhost:3000/inquilinos';

  private listaInquilinosSubject = new BehaviorSubject<IInquilino[]>([]);
  listaInquilinos$  = this.listaInquilinosSubject.asObservable();
  constructor(private http: HttpClient ) {}


  //crud
  cargarInquilinos(): Observable<IInquilino[]>{
    return this.http.get<IInquilino[]>(this.URL).pipe(
      tap( inquilinos => this.listaInquilinosSubject.next(inquilinos) )
    );  
  }

  crearInquilino( inquilino: IInquilino ): Observable<IInquilino>{
    return this.http.post<IInquilino>(this.URL, inquilino).pipe(
      tap( nuevoInquilino => {
        const listaActual = this.listaInquilinosSubject.getValue();
        this.listaInquilinosSubject.next([...listaActual, nuevoInquilino]);
      })
    )
  }
  eliminarInquilino( id: number ): Observable<void>{
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      tap( () => {
        const listaActual = this.listaInquilinosSubject.getValue()
        .filter( inquilino => inquilino.id !== id );
        this.listaInquilinosSubject.next( listaActual );
      } )
    );
  }

  actualizarInquilino( data: IInquilino ): Observable<IInquilino>{
    return this.http.put<IInquilino>(`${this.URL}/${data.id}`, data).pipe(
      tap( inquilinoActualizado => {
        const listaActual = this.listaInquilinosSubject.getValue()
        .map( inquilino => inquilino.id === inquilinoActualizado.id ? inquilinoActualizado : inquilino );
        this.listaInquilinosSubject.next( listaActual );
      } )
    );
  }
}
