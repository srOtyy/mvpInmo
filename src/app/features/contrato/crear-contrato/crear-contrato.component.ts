import { Component, OnInit } from '@angular/core';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { IPropietario } from '../../propietario/propietario.interface';
import { IInquilino } from '../../inquilino/inquilino.interface';
import { IInmueble } from '../../inmueble/inmueble.interface';
import { InquilinoRxjsService } from '../../inquilino/inquilino-rxjs.service';
import { InmueblesRxjsService } from '../../inmueble/inmuebles-rxjs.service';
import { IContrato } from '../contrato.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-crear-contrato',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss'
})
export class CrearContratoComponent implements OnInit {
  $listaPropietarios! :IPropietario[]
  $listaInquilinos! :IInquilino[]
  $listaInmuebles! :IInmueble[]


  formulario: FormGroup = new FormGroup({});
  constructor(
    private contratosService: ContratoBbddService,
    private _snack: SnackbarService,
    private _propietariosService: PropietarioRxjsService,
    private _inquilinosService: InquilinoRxjsService,
    private _inmueblesService: InmueblesRxjsService
  ){ 
    this.formulario = new FormGroup({
      id: new FormControl(this.randomId(), Validators.required), 
      propietarioId: new FormControl('', Validators.required),
      inmuebleId: new FormControl('', Validators.required),
      inquilinoId: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      rentaMensual: new FormControl('', [Validators.required, Validators.min(0)]),
      estado: new FormControl('preliminar', Validators.required)
      });
    }

  ngOnInit(){
    this.cargarDatos()
  }

  async cargarDatos(){
    try {
      this.$listaInmuebles = this._inmueblesService.$lista();
      this.$listaInquilinos = this._inquilinosService.$lista();
      this.$listaPropietarios = this._propietariosService.$lista();
      this._snack.mensajeSnackBar('Datos cargados exitosamente', 'Cerrar');
    }
    catch (error) {
      this._snack.mensajeSnackBar('Error al cargar datos', 'Cerrar');
    }
  }

  enviarContrato(contrato: IContrato){
    this.contratosService.crear(contrato).subscribe({
      next: () => {
        this._snack.mensajeSnackBar('Contrato creado exitosamente', 'Cerrar');
        this.formulario.reset();
        this.formulario.markAllAsTouched();
      },
      error: () => {
        this._snack.mensajeSnackBar('Error al crear contrato', 'Cerrar');
      }
    })
  }
  
  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }

 

}
