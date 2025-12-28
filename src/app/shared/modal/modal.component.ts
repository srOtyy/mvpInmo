import { Component,Inject,Type } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgComponentOutlet } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
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
      componente: Type<any>;
      componenteData?: any;
    }
  ) {}

  cerrar(){
    this.dialogRef.close();
  }

}
