import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseCrudService<T extends { id: number }> {
  $lista = signal<T[]>([]);
  constructor(
    protected http: HttpClient,
    protected endpoint: string,
  ) {}

  cargar(): Observable<T[]> {
    return this.http
      .get<T[]>(this.endpoint)
      .pipe(tap((lista) => this.$lista.set(lista)));
  }
  crear(entidad: T) {
    return this.http
      .post<T>(this.endpoint, entidad)
      .pipe(switchMap(() => this.cargar()));
  }
  // si en algun momento genera problema, actualizar el tipo de dato que es id
  actualizar(id: string | number, entidad: T) {
    return this.http
      .put<T>(`${this.endpoint}/${id}`, entidad)
      .pipe(switchMap(() => this.cargar()));
  }
  actualizarSinRecargar(id: string | number, entidad: T) {
    return this.http.put<T>(`${this.endpoint}/${id}`, entidad);
  }
  eliminar(id: number) {
    return this.http
      .delete<void>(`${this.endpoint}/${id}`)
      .pipe(
        map(() => {
          const listaActualizada = this.$lista().filter(
            (entidad) => entidad.id !== id,
          );
          this.$lista.set(listaActualizada);
          return listaActualizada;
        }),
      );
  }
  buscarEntidadPorId<T>(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }

  //para los contratos necesito emitir la lista de cada entidad
}
