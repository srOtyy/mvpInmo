import { Component, EventEmitter, Input, Output,ChangeDetectionStrategy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import {MatExpansionModule} from '@angular/material/expansion';


@Component({
  selector: 'app-item-entidad',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDividerModule, MatExpansionModule],
  templateUrl: './item-entidad.component.html',
  styleUrl: './item-entidad.component.scss'
})
export class ItemEntidadComponent<T > {
  @Input() entidad!: T;
  @Input() titulo: string | number | boolean = 'Entidad';
  @Input() contrato?: boolean = false; // Indica si es un contrato para mostrar el botón de agregar gastos
  @Output() ver = new EventEmitter<T>();
  @Output() editar = new EventEmitter<T>();
  @Output() eliminar = new EventEmitter<T>();
  @Output() agregarGastos = new EventEmitter<T>();
  readonly panelOpenState = signal(false);
  constructor( ) {  }
 
   verEntidad(){
     this.ver.emit(this.entidad);
   }
   editarEntidad(){
     this.editar.emit(this.entidad);
   }
   eliminarEntidad(){
     this.eliminar.emit(this.entidad);
   }
   agregarGastosEntidad(){
     if(this.agregarGastos){
       this.agregarGastos.emit(this.entidad);
     }
   }
}