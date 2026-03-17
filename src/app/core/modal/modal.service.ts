import { Injectable } from '@angular/core';
import { ModalData } from './modalData-interface';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../shared/modal/modal.component';
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  abrirModal<T>(titulo: string, componente: any, entidad: T){
    return this.dialog.open(ModalComponent, {
      data: { titulo, componente, componenteData: entidad } as ModalData<T>
    });
  }
}
