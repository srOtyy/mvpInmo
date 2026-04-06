import { Injectable } from '@angular/core';
import { DefinicionCaracteristica } from './definicion-caracteristica.interface';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Dominio } from '../../core/navegacion/navegacionRutas';
interface DefinicionesDominioResponse {
  id: string | number;
  dominio: Dominio;
  caracteristicas: DefinicionCaracteristica[];
}

@Injectable({
  providedIn: 'root'
})
export class DefinicionesCaracteristicasService {
  private readonly url = 'http://localhost:3000/definiciones';
  private definicionesPorDominio = new Map<Dominio, BehaviorSubject<DefinicionCaracteristica[]>>();
  private idPorDominio = new Map<Dominio, string | number>(); // esto es para saber si ya existe una definición para ese dominio y así decidir entre POST o PATCH
  // patch es lo mismo que post pero actualiza el recurso existente en lugar de crear uno nuevo, por eso necesitamos el id para saber a qué recurso apuntar

  constructor( private http: HttpClient ) {
    this.ensureDominio('propietarios');
    this.ensureDominio('inquilinos');
    this.ensureDominio('inmuebles');
    this.cargarDefinicionesIniciales();
  }

  getDefiniciones$(dominio: Dominio): Observable<DefinicionCaracteristica[]> {
    return this.ensureDominio(dominio).asObservable();
  }

  setDefiniciones(dominio: Dominio, definiciones: DefinicionCaracteristica[]): Observable<DefinicionCaracteristica[]> {
    const id = this.idPorDominio.get(dominio);
    const payload = {
      dominio,
      caracteristicas: definiciones.slice()
    };

    const request$ = id === undefined
      ? this.http.post<DefinicionesDominioResponse>(this.url, payload)
      : this.http.patch<DefinicionesDominioResponse>(`${this.url}/${id}`, payload);

    return request$.pipe(
      tap(definicionGuardada => {
        this.idPorDominio.set(dominio, definicionGuardada.id);
        this.ensureDominio(dominio).next(definicionGuardada.caracteristicas.slice());
      }),
      map(definicionGuardada => definicionGuardada.caracteristicas.slice())
    );
  }


  private ensureDominio(dominio: Dominio): BehaviorSubject<DefinicionCaracteristica[]> {
    let subject = this.definicionesPorDominio.get(dominio);

    if (!subject) {
      subject = new BehaviorSubject<DefinicionCaracteristica[]>([]);
      this.definicionesPorDominio.set(dominio, subject);
    }

    return subject;
  }

  private cargarDefinicionesIniciales(): void {
    //el argmento del .get, es una interfaz nueva que representa la respuesta del backend, que es un array de objetos con id, dominio y caracteristicas. Esto es para tener tipado en la respuesta y evitar errores de tipo.
    this.http.get<DefinicionesDominioResponse[]>(this.url).subscribe({
      next: definiciones => {
        for (const definicion of definiciones) {
          this.idPorDominio.set(definicion.dominio, definicion.id);
          this.ensureDominio(definicion.dominio).next(definicion.caracteristicas.slice());
        }
      },
      error: error => {
        console.error('Error al cargar definiciones iniciales:', error);
        return of([]);
      }
    });
  }
}
