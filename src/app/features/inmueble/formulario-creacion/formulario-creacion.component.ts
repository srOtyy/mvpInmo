  import { Component } from '@angular/core';
  import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
  import { definicionCaracteristicaInmueble, IInmueble } from '../inmueble.interface';
  import {MatFormFieldModule} from '@angular/material/form-field';
  import {MatInputModule} from '@angular/material/input';
  import { MatButton } from "@angular/material/button";
  import { SnackbarService } from '../../../core/snackbar.service';
  import { MatDividerModule } from '@angular/material/divider';
  import {MatSelectModule} from '@angular/material/select';
  import {MatCheckboxModule} from '@angular/material/checkbox';
  import {MatListModule} from '@angular/material/list';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';

  @Component({
    selector: 'app-formulario-creacion',
    standalone: true,
    imports: [MatButton,ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatDividerModule,MatListModule,MatSelectModule,MatCheckboxModule],
    templateUrl: './formulario-creacion.component.html',
    styleUrl: './formulario-creacion.component.scss'
  })
  export class FormularioCreacionComponent {

    nuevoInmueble!: IInmueble
    idRnd = Math.floor(Math.random() * 1000)
    formularioCaracteristicas: FormGroup
    listaCaracteristicas: definicionCaracteristicaInmueble[] = []

    constructor(  private formBuilder: FormBuilder,
      private _snackbarService: SnackbarService,
      private _inmuebleService: InmueblesRxjsService
    ){
    
      this._inmuebleService.listaCaracteristicas$.subscribe(caracteristicas => {
        this.listaCaracteristicas = caracteristicas;
      });
      this.formularioCaracteristicas = this.formBuilder.group({
        clave: new FormControl('',Validators.required),
        tipo: new FormControl('',Validators.required),
        requerido: new FormControl(false)
      })
    }  
    
    agregarCaracteristica(){
      if(this.formularioCaracteristicas.valid){
        const nuevaCaracteristica: definicionCaracteristicaInmueble = {
          clave: this.formularioCaracteristicas.get('clave')?.value,
          tipo: this.formularioCaracteristicas.get('tipo')?.value,
          requerido: this.formularioCaracteristicas.get('requerido')?.value
        };
        this.listaCaracteristicas.push(nuevaCaracteristica);
        this.formularioCaracteristicas.reset();
      }
    }
  }
