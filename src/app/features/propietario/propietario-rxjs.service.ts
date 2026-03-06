import { Injectable } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService {
  URL = 'http://localhost:3000/propietarios';
  private listaPropietariosSubject = new BehaviorSubject<IPropietario[]>([]);
  listaPropietarios$ = this.listaPropietariosSubject.asObservable();

  constructor(private http: HttpClient) {}

  cargarPropietarios(): Observable<IPropietario[]> {
    return this.http.get<IPropietario[]>(this.URL).pipe(
      tap((propietarios) => this.listaPropietariosSubject.next(propietarios))
    );
  }

  crearPropietario(data: IPropietario): Observable<IPropietario> {
    return this.http.post<IPropietario>(this.URL, data).pipe(
      tap((nuevoPropietario) => {
        const propietariosActuales = this.listaPropietariosSubject.getValue();
        this.listaPropietariosSubject.next([...propietariosActuales, nuevoPropietario]);
      })
    );
  }

  actualizarPropietario(data: IPropietario): Observable<IPropietario> {
    return this.http.put<IPropietario>(`${this.URL}/${data.id}`, data).pipe(
      tap((propietarioActualizado) => {
        const propietariosActuales = this.listaPropietariosSubject
          .getValue()
          .map((propietario) =>
            propietario.id === propietarioActualizado.id ? propietarioActualizado : propietario
          );
        this.listaPropietariosSubject.next(propietariosActuales);
      })
    );
  }

  eliminarPropietario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${id}`).pipe(
      tap(() => {
        const propietariosActuales = this.listaPropietariosSubject
          .getValue()
          .filter((propietario) => propietario.id !== id);
        this.listaPropietariosSubject.next(propietariosActuales);
      })
    );
  }
}
