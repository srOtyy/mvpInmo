import { Component,Inject,Type } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgComponentOutlet } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { SimpleModalData } from '../../core/modal/modalData-interface';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule,NgComponentOutlet,MatDividerModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  public data: SimpleModalData<unknown>;
  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) injectedData: SimpleModalData<unknown>
  ) {
    this.data = injectedData;
  }

  cerrar(){
    this.dialogRef.close();
  }

}
