import { Component, Input, OnInit, signal } from '@angular/core';
import {
  Liquidacion,
  LiquidacionItem,
} from '../../../liquidacion/liquidacion-interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LiquidacionGeneratorService } from '../../../liquidacion/liquidacion.service';
import { SnackbarService } from '../../../../core/snackbar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { numeroALetras } from '../../../../shared/utilitys';
import {
  EstadoServicioLiquidacion,
  SeguimientoEGLAI,
} from '../../eglai.interface';
export enum TipoGasto {
  Inquilino = 1,
  Propietario = 2,
}

interface GastoLiquidacion {
  tipo: string;
  monto: number;
  confirmado: boolean;
}

@Component({
  selector: 'app-agregar-gastos-contrato',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatListModule,
    MatTooltipModule,
    MatDividerModule,
    MatStepperModule,
    MatSlideToggleModule,
  ],
  templateUrl: './agregar-gastos-contrato.component.html',
  styleUrl: './agregar-gastos-contrato.component.scss',
})
export class AgregarGastosContratoComponent implements OnInit {
  @Input() entidad!: Liquidacion;
  $gastosInquilino = signal<GastoLiquidacion[]>([]);
  $gastosPropietario = signal<GastoLiquidacion[]>([]);
  guardandoEGLAI = false;
  readonly serviciosEGLAI: { key: keyof SeguimientoEGLAI; label: string }[] = [
    { key: 'expensas', label: 'Expensas' },
    { key: 'gas', label: 'Gas' },
    { key: 'luz', label: 'Luz' },
    { key: 'agua', label: 'Agua' },
    { key: 'internet', label: 'Internet' },
    { key: 'seguro', label: 'Seguro' },
  ];
  formularioInquilino = new FormGroup({
    tipo: new FormControl('', Validators.required),
    monto: new FormControl('', Validators.required),
  });
  formularioPropietario = new FormGroup({
    tipo: new FormControl('', Validators.required),
    monto: new FormControl('', Validators.required),
  });

  constructor(
    private _liquidacion: LiquidacionGeneratorService,
    private _snack: SnackbarService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.entidad.EGLAI ??= {
      expensas: 'no-requerido',
      gas: 'no-requerido',
      luz: 'no-requerido',
      agua: 'no-requerido',
      internet: 'no-requerido',
      seguro: 'no-requerido',
    };
    this.buscarGastosExistentes(TipoGasto.Inquilino);
    this.buscarGastosExistentes(TipoGasto.Propietario);
  }

  cambiarEstadoEGLAI(
    servicio: keyof SeguimientoEGLAI,
    pendiente: boolean,
  ): void {
    this.actualizarEstadoEGLAI(
      servicio,
      pendiente ? 'pendiente' : 'no-requerido',
    );
  }

  marcarServicioComoCargado(servicio: keyof SeguimientoEGLAI): void {
    this.actualizarEstadoEGLAI(servicio, 'cargado');
  }

  private actualizarEstadoEGLAI(
    servicio: keyof SeguimientoEGLAI,
    nuevoEstado: EstadoServicioLiquidacion,
  ): void {
    if (this.guardandoEGLAI) return;
    if (this.entidad.EGLAI[servicio] === nuevoEstado) return;

    const estadoAnterior = this.entidad.EGLAI[servicio];
    this.entidad.EGLAI[servicio] = nuevoEstado;
    this.guardandoEGLAI = true;

    this._liquidacion.actualizar(this.entidad.id, this.entidad).subscribe({
      next: () => (this.guardandoEGLAI = false),
      error: (error) => {
        this.entidad.EGLAI[servicio] = estadoAnterior;
        this.guardandoEGLAI = false;
        this._snack.mensajeSnackBar('No se pudo actualizar EGLAI', 'Cerrar');
        console.error('No se pudo actualizar el seguimiento EGLAI', error);
      },
    });
  }

  etiquetaEstadoEGLAI(servicio: keyof SeguimientoEGLAI): string {
    const estado = this.entidad.EGLAI[servicio];
    if (estado === 'pendiente') return 'Pendiente';
    if (estado === 'cargado') return 'Cargado';
    return 'No requerido';
  }

  private buscarGastosExistentes(tipo: TipoGasto): void {
    const items =
      tipo === TipoGasto.Inquilino
        ? this.entidad.itemsInquilino
        : this.entidad.itemsPropietario;
    const signal =
      tipo === TipoGasto.Inquilino
        ? this.$gastosInquilino
        : this.$gastosPropietario;

    if (items) {
      const gastosIniciales = items.map((item) => ({
        tipo: item.descripcion,
        monto: item.monto,
        confirmado: true,
      }));
      signal.set(gastosIniciales);
    }
  }

  agregarGastoTemporal(tipo: TipoGasto): void {
    const formulario =
      tipo === TipoGasto.Inquilino
        ? this.formularioInquilino
        : this.formularioPropietario;

    if (formulario.valid) {
      const nuevoGasto: GastoLiquidacion = {
        tipo: formulario.controls.tipo.value!,
        monto: +formulario.controls.monto.value!,
        confirmado: false,
      };

      if (tipo === TipoGasto.Inquilino) {
        this.$gastosInquilino.update((gastos) => [...gastos, nuevoGasto]);
      } else {
        this.$gastosPropietario.update((gastos) => [...gastos, nuevoGasto]);
      }

      formulario.reset();
      formulario.markAllAsTouched();
    } else {
      console.log('Formulario invalido');
    }
  }

  eliminarGastoTemporal(index: number, tipo: TipoGasto): void {
    if (tipo === TipoGasto.Inquilino) {
      this.$gastosInquilino.update((gastos) =>
        gastos.filter((_, i) => i !== index),
      );
    } else {
      this.$gastosPropietario.update((gastos) =>
        gastos.filter((_, i) => i !== index),
      );
    }
  }

  private convertirAGastosLiquidacion(tipo: TipoGasto): LiquidacionItem[] {
    const gastos =
      tipo === TipoGasto.Inquilino
        ? this.$gastosInquilino()
        : this.$gastosPropietario();
    return gastos.map((gasto) => ({
      descripcion: gasto.tipo,
      monto: gasto.monto,
      montoTexto: numeroALetras(gasto.monto),
    }));
  }

  agregarGastosALiquidacion(tipo: TipoGasto): void {
    if (tipo === TipoGasto.Inquilino) {
      this.entidad.itemsInquilino = this.convertirAGastosLiquidacion(tipo);
    } else {
      this.entidad.itemsPropietario = this.convertirAGastosLiquidacion(tipo);
    }

    this._liquidacion.actualizar(this.entidad.id, this.entidad).subscribe({
      next: () => {
        if (tipo === TipoGasto.Inquilino) {
          this.$gastosInquilino.update((gastos) =>
            gastos.map((g) => ({ ...g, confirmado: true })),
          );
        } else {
          this.$gastosPropietario.update((gastos) =>
            gastos.map((g) => ({ ...g, confirmado: true })),
          );
        }
        this.formularioInquilino.reset();
        this.formularioInquilino.markAllAsTouched();
        this.formularioPropietario.reset();
        this.formularioPropietario.markAllAsTouched();
        this._snack.mensajeSnackBar('Gastos agregados', 'Cerrar');
      },
    });
  }

  volverALaVistaDeContratos(): void {
    this._router.navigate(['/contratos/vista']);
  }

  generarLiquidacionPropietario(liquidacion: Liquidacion): void {
    this._liquidacion.generarLiquidacionPropietario(liquidacion);
  }
  generarLiquidacionInquilino(liquidacion: Liquidacion): void {
    this._liquidacion.generarLiquidacionInquilinoDocx(liquidacion);
  }
  generarMinutaPropietario(liquidacion: Liquidacion): void {
    this._liquidacion.generarMinutaPropietario(liquidacion);
  }
  generarReciboInquilino(liquidacion: Liquidacion): void {
    this._liquidacion.generarReciboInquilino(liquidacion);
  }
  generarLiquidacionInquilinoTransferencia(liquidacion: Liquidacion): void {
    this._liquidacion.generarLiquidacionInquilinoTransferencia(liquidacion);
  }
}
