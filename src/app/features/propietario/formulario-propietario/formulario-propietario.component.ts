import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IPropietario } from '../propietario.interface';
import { MatButton } from "@angular/material/button";
import { PropietarioSService } from '../propietario-s.service';
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

  constructor( private formBuilder: FormBuilder, private _propietarioService: PropietarioSService){
    this.formularioPropietario = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cbu: new FormControl('', [Validators.required]),
    })
  }

  enviarFormulario(){
    if(this.formularioPropietario.valid){
      this._propietarioService.agregarNuevoPropietario(this.formularioPropietario.value)
      //aca deberia hacer un mensaje que diga "propietario creado con exito" con los snackbar de angular material
      this.formularioPropietario.reset()
    }
  }
}
