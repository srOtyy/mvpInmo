import { Component,Inject,Type } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgComponentOutlet } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { IEntityBase } from '../entity-base.interface';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule,NgComponentOutlet,MatDividerModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string;
      //(*excepcion 1)any autorizado 100%. La interfaz ModalData acepta como componente cualquier tipo de componente, por lo que no es necesario especificar un tipo concreto. Además, el método abrirModal es genérico, lo que permite que el tipo de datos del componente sea flexible y se adapte a las necesidades de cada caso.
      componente: Type<any>;
      componenteData?: any;
    }
  ) {}
  mostrarData(){
    console.log(this.data.componenteData);
  }
  cerrar(){
    this.dialogRef.close();
  }

}
