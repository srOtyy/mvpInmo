import { Component, computed, signal } from '@angular/core';
import { Liquidacion, LiquidacionItem } from '../../../liquidacion/liquidacion-interface';
interface GastoLiquidacion {
  tipo: string; // 'agua' | 'electricidad' | 'arreglos'
  monto: number;
}
@Component({
  selector: 'app-agregar-gastos-contrato',
  standalone: true,
  imports: [],
  templateUrl: './agregar-gastos-contrato.component.html',
  styleUrl: './agregar-gastos-contrato.component.scss'
})

export class AgregarGastosContratoComponent {
  gastos = signal<GastoLiquidacion[]>([]);
  totalGastos = computed(() => {
    return this.gastos().reduce((total, gasto) => total + gasto.monto, 0);
  });
  constructor(){}
  //crud
  agregarGastoTemporal(tipo: string, monto: number) {
    const nuevoGasto: GastoLiquidacion = { tipo, monto };
    this.gastos.update(gastosActuales => [...gastosActuales, nuevoGasto]);
  }
  eliminarGastoTemporal(index: number) {
    this.gastos.update(gastosActuales => 
      gastosActuales.filter((_, i) => i !== index)
    );
  }
  convertirAGastosLiquidacion(): LiquidacionItem[] {
    return this.gastos().map(gasto => ({
      descripcion: gasto.tipo,
      monto: gasto.monto
    }));
  }
  // emitirGastos(liquidacion: Liquidacion): void {
  //    liquidacion.items = [...liquidacion.items, ...this.convertirAGastosLiquidacion()];
  //    liquidacion.total = liquidacion.items.reduce((sum, item) => sum + item.monto, 0);
  //    // Aquí podrías agregar lógica adicional para guardar la liquidación actualizada en tu backend o servicio
  // }
}
