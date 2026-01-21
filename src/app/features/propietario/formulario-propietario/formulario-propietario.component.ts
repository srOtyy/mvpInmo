import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IPropietario } from '../propietario.interface';
import { MatButton } from "@angular/material/button";
import { PropietarioRxjsService } from '../propietario-rxjs.service';
import { SnackbarService } from '../../../core/snackbar.service';
@Component({
  selector: 'app-formulario-propietario',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButton],
  templateUrl: './formulario-propietario.component.html',
  styleUrl: './formulario-propietario.component.scss'
})
export class FormularioPropietarioComponent {
  formularioPropietario: FormGroup
  nuevoPropietario!: IPropietario
  idRnd = Math.floor(Math.random() * 1000)

  constructor( private formBuilder: FormBuilder, private _propietariosRxJsService: PropietarioRxjsService,
    private _snackbarService: SnackbarService
  ){
    this.formularioPropietario = this.formBuilder.group({
      id: new FormControl(this.idRnd, [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cbu: new FormControl('', [Validators.required]),
      inmuebles: new FormControl([], [])  
    })
  }

  enviarFormulario(){
    if(this.formularioPropietario.valid){
      this._propietariosRxJsService.agregarPropietario(this.formularioPropietario.value)
      this.formularioPropietario.reset()
      this._snackbarService.mensajeSnackBar('Propietario creado con éxito', 'Cerrar');
    }
  }
}
