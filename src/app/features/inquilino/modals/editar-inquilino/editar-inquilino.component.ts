import { Component, Input, OnInit } from '@angular/core';
import { IInquilino } from '../../inquilino.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InquilinoRxjsService } from '../../inquilino-rxjs.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../../core/snackbar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-editar-inquilino',
  standalone: true,
  imports: [MatFormField,ReactiveFormsModule,MatInputModule,MatButton],
  templateUrl: './editar-inquilino.component.html',
  styleUrl: './editar-inquilino.component.scss'
})
export class EditarInquilinoComponent implements OnInit{
 @Input() entidad!: IInquilino;
 formularioEditarInquilino: FormGroup;

 constructor( private formBuilder: FormBuilder, private _inquilinoRxJsService: InquilinoRxjsService, private dialogRef: MatDialogRef<ModalComponent>,private _snackbarService: SnackbarService){
    this.formularioEditarInquilino = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      garante: new FormControl('', [Validators.required]),
      ingresos: new FormControl('', [Validators.required]),
    });
    
  }
 
  ngOnInit(){
    this.pasarDatosInquilino(this.entidad);
  }
  pasarDatosInquilino(inquilinoData: IInquilino) {
    this.formularioEditarInquilino.setValue({
      id: inquilinoData.id,
      nombre: inquilinoData.nombre,
      dni: inquilinoData.dni,
      telefono: inquilinoData.telefono,
      email: inquilinoData.email,
      garante: inquilinoData.garante,
      ingresos: inquilinoData.ingresos,
    });
  }

  guardarCambios() {  
    this._inquilinoRxJsService.editarInquilino(this.formularioEditarInquilino.value)
    this._snackbarService.mensajeSnackBar('Inquilino editado con éxito', 'Cerrar');
    this.dialogRef.close(true);
  }
}
