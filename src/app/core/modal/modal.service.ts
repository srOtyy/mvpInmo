import { Injectable, Type } from '@angular/core';
import { ModalContentComponent, SimpleModalData} from './modalData-interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../shared/modal/modal.component';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  //MatDialogRef tiene un any de excepcion
  constructor(private dialog: MatDialog) { }
  abrirModal<T>(
    titulo: string,
    componente: Type<ModalContentComponent<T>>,
    entidad: T
  ): MatDialogRef<ModalComponent, any> { 
    return this.dialog.open(ModalComponent, {
      data: {
        titulo,
        componente,
        componenteData: entidad
      } as SimpleModalData<T>
    });
  }
}
