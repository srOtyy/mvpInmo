import { Component } from '@angular/core';
import { InquilinoCComponent } from '../inquilino-c/inquilino-c.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-formulario-inquilino',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatButton],
  templateUrl: './formulario-inquilino.component.html',
  styleUrl: './formulario-inquilino.component.scss'
})
export class FormularioInquilinoComponent {
  formularioInquilino: FormGroup
  nuevoInquilino!: InquilinoCComponent

  constructor(private formBuilder: FormBuilder, private _inquilinosRxJsService: InquilinoRxjsService, private _snackbarService: SnackbarService){
    this.formularioInquilino = this.formBuilder.group({
      id: new FormControl('',[Validators.required]),
      nombre: new FormControl('',[Validators.required]),
      dni: new FormControl('',[Validators.required]),
      telefono: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      garante: new FormControl('',[Validators.required]),
      ingresos: new FormControl('',[Validators.required]),
    })
  }

  enviarFormulario(){
    if(this.formularioInquilino.valid){
      this._inquilinosRxJsService.agregarInquilino(this.formularioInquilino.value)
      this.formularioInquilino.reset()
      this._snackbarService.mensajeSnackBar('Inquilino creado con éxito', 'Cerrar');
    }
  }
}
