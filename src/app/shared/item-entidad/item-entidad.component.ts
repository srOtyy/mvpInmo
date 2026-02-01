import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-item-entidad',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './item-entidad.component.html',
  styleUrl: './item-entidad.component.scss'
})
export class ItemEntidadComponent<T> {

  @Input() entidad!: T;
  @Input() titulo: string = 'Entidad';
  @Output() ver = new EventEmitter<T>();
  @Output() editar = new EventEmitter<T>();
  @Output() eliminar = new EventEmitter<T>();

  verEntidad(){
    this.ver.emit(this.entidad);
  }
  editarEntidad(){
    this.editar.emit(this.entidad);
  }
  eliminarEntidad(){
    this.eliminar.emit(this.entidad);
  }
}