import { Injectable } from '@angular/core';
import { ModalData } from './modalData-interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../shared/modal/modal.component';
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }
  //(*excepcion 1)any autorizado 100%. La interfaz ModalData acepta como componente cualquier tipo de componente, por lo que no es necesario especificar un tipo concreto. Además, el método abrirModal es genérico, lo que permite que el tipo de datos del componente sea flexible y se adapte a las necesidades de cada caso.
  abrirModal<T>(titulo: string, componente: any, entidad: T){
    return this.dialog.open(ModalComponent, {
      data: { titulo, componente, componenteData: entidad } as ModalData<T>
    });
  }
}
