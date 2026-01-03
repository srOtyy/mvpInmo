import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInquilino } from './inquilino.interface';
import { SnackbarService } from '../../core/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class InquilinoRxjsService {

  private listaInquilinosSubject = new BehaviorSubject<IInquilino[]>([]);
  listaInquilinos$ : Observable<IInquilino[]> = this.listaInquilinosSubject.asObservable();
  constructor( ) {}


  //crud
  agregarInquilino( inquilino: IInquilino ){
    const listaActual = this.listaInquilinosSubject.getValue();
    this.listaInquilinosSubject.next([...listaActual, inquilino]);
  }
  eliminarInquilino( id: number ){
    const listaActual = this.listaInquilinosSubject.getValue();
    const listaFiltrada = listaActual.filter( inquilino => inquilino.id !== id );
    this.listaInquilinosSubject.next( listaFiltrada );
  }
  editarInquilino( inquilinoEditado: IInquilino ){
    const listaActual = this.listaInquilinosSubject.getValue();
    const listaActualizada = listaActual.map(i => i.id === inquilinoEditado.id ? inquilinoEditado : i);
    this.listaInquilinosSubject.next( listaActualizada );
  }
}
