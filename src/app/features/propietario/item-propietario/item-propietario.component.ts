import { Component, Input } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import {MatDividerModule} from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { VerInfoPropietarioComponent } from '../modals/ver-info-propietario/ver-info-propietario.component';
import { EditarPropietarioComponent } from '../modals/editar-propietario/editar-propietario.component';
import { EliminarPropietarioComponent } from '../modals/eliminar-propietario/eliminar-propietario.component';

@Component({
  selector: 'app-item-propietario',
  standalone: true,
  imports: [MatDividerModule,MatButton,MatIconModule],
  templateUrl: './item-propietario.component.html',
  styleUrl: './item-propietario.component.scss'
})
export class ItemPropietarioComponent {

  @Input() propietario!: IPropietario;
  constructor(private dialog: MatDialog, ) {}

  abrirModalVista(){
    this.dialog.open(ModalComponent,{
      data: {
        titulo: 'Datos del Propietario',
        componente: VerInfoPropietarioComponent,
        componenteData: {propietario: this.propietario}
      }
    })
    
  }
  abrirModalEditar(){
    this.dialog.open(ModalComponent,{
      data: {
        titulo: 'Editar Propietario',
        componente: EditarPropietarioComponent,
        componenteData: {propietario: this.propietario}
      }
    })
  }
  abrirModalEliminar(){
    this.dialog.open(ModalComponent,{
      data: {
        titulo: 'Eliminar Propietario',
        componente: EliminarPropietarioComponent,
        componenteData: {propietario: this.propietario}
      }
    })
  }
}
