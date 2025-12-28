import { Injectable } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService {
  // estado interno
  private listaPropietariosSubject = new BehaviorSubject<IPropietario[]>([]);
  // estado externo ( lectura )
  lsitaPropietarios$ : Observable<IPropietario[]> = this.listaPropietariosSubject.asObservable();
  constructor() { }

  //getter and setter
  obtenerListaPropietarios(): IPropietario[]{
    return this.listaPropietariosSubject.getValue();
  }
  establecerListaPropietarios( nuevaLista: IPropietario[] ){
    this.listaPropietariosSubject.next( nuevaLista );
  }
  
  //crud
  agregarPropietario( propietario: IPropietario ){
    const listaActual = this.listaPropietariosSubject.getValue();
    this.listaPropietariosSubject.next([...listaActual, propietario]);
  }
  eliminarPropietario( id: number ){
    const listaActual = this.listaPropietariosSubject.getValue();
    const listaFiltrada = listaActual.filter( propietario => propietario.id !== id );
    this.listaPropietariosSubject.next( listaFiltrada );
  }
  editarPropietario( propietarioEditado: IPropietario ){
    const listaActual = this.listaPropietariosSubject.getValue();
    const listaActualizada = listaActual.map( propietario => {
      if( propietario.id === propietarioEditado.id ){
        return propietarioEditado;
      }
      return propietario;
    });
    this.listaPropietariosSubject.next( listaActualizada );
  }
}
