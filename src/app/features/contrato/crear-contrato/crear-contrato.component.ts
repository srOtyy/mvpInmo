import { Component, OnInit } from '@angular/core';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { IContrato } from '../contrato.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IPropietario } from '../../propietario/propietario.interface';
import { IInquilino } from '../../inquilino/inquilino.interface';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { randomId } from '../../../shared/utilitys';
@Component({
  selector: 'app-crear-contrato',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss'
})
export class CrearContratoComponent implements OnInit {
 
  formulario: FormGroup = new FormGroup({});
  constructor(
    private contratosService: ContratoBbddService,
    private _snack: SnackbarService,
  ){ 
    this.formulario = new FormGroup({
      id: new FormControl(randomId(), Validators.required), 
      propietarioId: new FormControl('', Validators.required),
      inmuebleId: new FormControl('', Validators.required),
      inquilinoId: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      rentaMensual: new FormControl('', [Validators.required, Validators.min(0)]),
      estado: new FormControl('preliminar', Validators.required)
      });
    }

  async ngOnInit(): Promise<void> {
    await this.contratosService.obtenerListas().catch(error => {
        console.error('Error al cargar las listas para el formulario de contratos:', error);
        this._snack.mensajeSnackBar('Error al cargar datos para el formulario', 'Cerrar');
    });
  }

  get propietariosLista() {
    return this.contratosService.$listaPropietarios;
  }
  get inquilinosLista() {
    return this.contratosService.$listaInquilinos;
  }
  get inmueblesLista() {
    return this.contratosService.$listaInmuebles;
  }

  
  nombrePropietario(propietario: IPropietario): string {
    return obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
  }
  nombreInquilino(inquilino: IInquilino): string {
    return obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible').toString();
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

}
