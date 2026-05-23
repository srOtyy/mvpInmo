import { Component, Input, OnInit, signal } from '@angular/core';
import { Liquidacion, LiquidacionItem } from '../../../liquidacion/liquidacion-interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LiquidacionGeneratorService } from '../../../liquidacion/liquidacion.service';
import { SnackbarService } from '../../../../core/snackbar.service';
interface GastoLiquidacion {
  tipo: string; // 'agua' | 'electricidad' | 'arreglos'
  monto: number;
}
@Component({
  selector: 'app-agregar-gastos-contrato',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule,MatIcon ,MatListModule],
  templateUrl: './agregar-gastos-contrato.component.html',
  styleUrl: './agregar-gastos-contrato.component.scss'
})

export class AgregarGastosContratoComponent implements OnInit {
  @Input() entidad!: Liquidacion;
  $gastos = signal<GastoLiquidacion[]>([]);
  formularioGasatos = new FormGroup({
    tipo: new FormControl(''),
    monto: new FormControl('')
  });
  constructor( private _liquidacion: LiquidacionGeneratorService, private _snack: SnackbarService){}
  
  ngOnInit(): void {
    if (this.entidad.items.length > 0){
      const gastosIniciales = this.entidad.items.map(item => ({
        tipo: item.descripcion,
        monto: item.monto
      }));
      this.$gastos.set(gastosIniciales);
    } 
  }
  agregarGastoTemporal() {
    if (this.formularioGasatos.controls.monto.value != null && this.formularioGasatos.controls.tipo.value != null){
      const tipo: string = this.formularioGasatos.controls.tipo.value 
      // agregue un + adelante de la extraccion del formcontrol porque traia un string en lugar de number 
      const monto: number = +this.formularioGasatos.controls.monto.value      
      const nuevoGasto: GastoLiquidacion = { tipo, monto };
      this.$gastos.update(gastosActuales => [...gastosActuales, nuevoGasto]);
      this.formularioGasatos.reset()
      this.formularioGasatos.markAllAsTouched()
    }else{
      console.log("los formcontrol extraidos dan null")
    }
  }
  eliminarGastoTemporal(index: number) {
    this.$gastos.update(gastosActuales => 
      gastosActuales.filter((_, i) => i !== index)
    );
  }

  // convertir los gastos temporales a LiquidacionItem para agregarlos a la liquidacion 
  convertirAGastosLiquidacion(): LiquidacionItem[] {
    return this.$gastos().map(gasto => ({
      descripcion: gasto.tipo,
      monto: gasto.monto
    }));
  }
  //agregar gastos a la liquidacion
  agregarGastosALiquidacion(){
    this.entidad.items = this.convertirAGastosLiquidacion()
    this._liquidacion.actualizar(this.entidad.id, this.entidad).subscribe({
      next: ()=> {
        this.formularioGasatos.reset()
        this.formularioGasatos.markAllAsTouched()
        this._snack.mensajeSnackBar("Gastos agregados","Cerrar")
      }
    })
  }
 
}
