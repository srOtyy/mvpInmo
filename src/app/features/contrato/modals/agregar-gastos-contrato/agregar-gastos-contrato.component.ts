import { Component, Input, OnInit, signal } from '@angular/core';
import { Liquidacion, LiquidacionItem } from '../../../liquidacion/liquidacion-interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { numeroALetras } from '../../../../shared/utilitys';
export enum TipoGasto {
  Inquilino = 1,
  Propietario = 2
}

interface GastoLiquidacion {
  tipo: string;
  monto: number;
  confirmado: boolean;
}

@Component({
  selector: 'app-agregar-gastos-contrato',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, MatListModule, MatTooltipModule, MatDividerModule, MatStepperModule],
  templateUrl: './agregar-gastos-contrato.component.html',
  styleUrl: './agregar-gastos-contrato.component.scss'
})

export class AgregarGastosContratoComponent implements OnInit {
  entidad!: Liquidacion;
  $gastosInquilino = signal<GastoLiquidacion[]>([]);
  $gastosPropietario = signal<GastoLiquidacion[]>([]);
  formularioInquilino = new FormGroup({
    tipo: new FormControl('', Validators.required),
    monto: new FormControl('', Validators.required)
  });
  formularioPropietario = new FormGroup({
    tipo: new FormControl('', Validators.required),
    monto: new FormControl('', Validators.required)
  });

  constructor(
    private _liquidacion: LiquidacionGeneratorService,
    private _snack: SnackbarService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.entidad = this._liquidacion.$liquidacionSeleccionada();
    this.buscarGastosExistentes(TipoGasto.Inquilino);
    this.buscarGastosExistentes(TipoGasto.Propietario);
  }

  private buscarGastosExistentes(tipo: TipoGasto): void {
    const items = tipo === TipoGasto.Inquilino ? this.entidad.itemsInquilino : this.entidad.itemsPropietario;
    const signal = tipo === TipoGasto.Inquilino ? this.$gastosInquilino : this.$gastosPropietario;

    if (items) {
      const gastosIniciales = items.map(item => ({
        tipo: item.descripcion,
        monto: item.monto,
        confirmado: true
      }));
      signal.set(gastosIniciales);
    }
  }

  agregarGastoTemporal(tipo: TipoGasto): void {
    const formulario = tipo === TipoGasto.Inquilino ? this.formularioInquilino : this.formularioPropietario;

    if (formulario.valid) {
      const nuevoGasto: GastoLiquidacion = {
        tipo: formulario.controls.tipo.value!,
        monto: +(formulario.controls.monto.value!),
        confirmado: false
      };

      if (tipo === TipoGasto.Inquilino) {
        this.$gastosInquilino.update(gastos => [...gastos, nuevoGasto]);
      } else {
        this.$gastosPropietario.update(gastos => [...gastos, nuevoGasto]);
      }

      formulario.reset();
      formulario.markAllAsTouched();
    } else {
      console.log('Formulario invalido');
    }
  }

  eliminarGastoTemporal(index: number, tipo: TipoGasto): void {
    if (tipo === TipoGasto.Inquilino) {
      this.$gastosInquilino.update(gastos => gastos.filter((_, i) => i !== index));
    } else {
      this.$gastosPropietario.update(gastos => gastos.filter((_, i) => i !== index));
    }
  }

  private convertirAGastosLiquidacion(tipo: TipoGasto): LiquidacionItem[] {
    const gastos = tipo === TipoGasto.Inquilino ? this.$gastosInquilino() : this.$gastosPropietario();
    return gastos.map(gasto => ({
      descripcion: gasto.tipo,
      monto: gasto.monto,
      montoTexto: numeroALetras(gasto.monto)
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
          this.$gastosInquilino.update(gastos => gastos.map(g => ({ ...g, confirmado: true })));
        } else {
          this.$gastosPropietario.update(gastos => gastos.map(g => ({ ...g, confirmado: true })));
        }
        this.formularioInquilino.reset();
        this.formularioInquilino.markAllAsTouched();
        this.formularioPropietario.reset();
        this.formularioPropietario.markAllAsTouched();
        this._snack.mensajeSnackBar('Gastos agregados', 'Cerrar');
      }
    });
  }

  volverALaVistaDeContratos(): void {
    this._router.navigate(['/contratos/vista']);
  }

  generarLiquidacionPropietario(liquidacion: Liquidacion): void{
    this._liquidacion.generarLiquidacionPropietarioDocx(liquidacion)
  }
  generarLiquidacionInquilino(liquidacion: Liquidacion):void{
    this._liquidacion.generarLiquidacionInquilinoDocx(liquidacion)
  }
  generarMinutaPropietario(liquidacion: Liquidacion): void{
    this._liquidacion.generarMinutaPropietario(liquidacion)
  }
  generarReciboInquilino(liquidacion: Liquidacion):void{
    this._liquidacion.generarReciboInquilino(liquidacion)
  }
}
