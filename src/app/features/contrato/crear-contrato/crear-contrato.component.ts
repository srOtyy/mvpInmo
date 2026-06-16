import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
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
import { NotificacionesService } from '../../notificaciones/notificaciones.service';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
@Component({
  selector: 'app-crear-contrato',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss'
})
export class CrearContratoComponent implements OnInit {
  propietarioEleigido: string | null = null;
  formulario: FormGroup = new FormGroup({});
  constructor(
    private contratosService: ContratoBbddService,
    private _snack: SnackbarService,
    private _liquidacion: LiquidacionGeneratorService
  ){ 
    this.formulario = new FormGroup({
      id: new FormControl(randomId(), Validators.required), 
      propietarioId: new FormControl('', Validators.required),
      inmuebleId: new FormControl('', Validators.required),
      inquilinoId: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      rentaMensual: new FormControl('', [Validators.required, Validators.min(0)]),
      estado: new FormControl('preliminar', Validators.required),
      periodoAumento: new FormControl('',Validators.required),
      proximoAumento: new FormControl(''),
      titulo: new FormControl(''),
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

   get filteredInmueblesLista() {
     const propietarioId = this.formulario.get('propietarioId')?.value;
     if (!propietarioId) {
       return this.inmueblesLista;
     }
     return this.inmueblesLista.filter(inmueble => inmueble.idPropietario === propietarioId);
   }
   enviarContrato(){
    const contrato: IContrato = this.formulario.value
    if(this.formulario.get('titulo')?.value === ''){
      contrato.titulo = this.contratosService.generarTituloContrato(contrato.propietarioId.toString(), contrato.inquilinoId.toString());
    }
    contrato.proximoAumento = this.contratosService.declararProximoMesDeAumento(contrato.periodoAumento, contrato.fechaInicio);
    console.log(this.formulario.value)
    this.contratosService.crear(contrato).subscribe({
      next: () => {
        this._snack.mensajeSnackBar('Contrato creado exitosamente', 'Cerrar');
        /*
        En este lugar se tiene que crear la liquidacion del contrato. ¿Que datos necesito para crear la liquidacion? El contrato, el nombre del propietario, el nombre del inquilino y los items de la liquidacion. 
        */
        const liquidacion = this._liquidacion.crearLiquidacion(contrato, this.nombrePropietarioXId(contrato.propietarioId), this.nombreInquilinoXId(contrato.inquilinoId));
        //suscripcion innecesaria ? o tengo que volverlo una promesa ? 
        this._liquidacion.crear(liquidacion).subscribe({
          next: () => {
          },
          error: () => {
            console.error("Error al crear la liquidacion");
          }
        });
        this.formulario.reset();
        this.formulario.markAllAsTouched();
      },
      error: () => {
        this._snack.mensajeSnackBar('Error al crear contrato', 'Cerrar');
      }
    })
  }
  

  // Las funciones de abajo creo que se podrían mejorar porque apuntan a lo mismo
  
  nombrePropietario(propietario: IPropietario): string {
    return obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
  }
  nombreInquilino(inquilino: IInquilino): string {
    return obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible').toString();
  }
  nombrePropietarioXId(id: number): string {
    const propietario = this.propietariosLista.find(p => p.id === id);
    return propietario ? this.nombrePropietario(propietario) : 'Nombre no disponible';
  }
  nombreInquilinoXId(id: number): string {
    const inquilino = this.inquilinosLista.find(i => i.id === id);
    return inquilino ? this.nombreInquilino(inquilino) : 'Nombre no disponible';
  }
  
}
