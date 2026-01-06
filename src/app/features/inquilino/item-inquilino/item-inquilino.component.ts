import { Component, Input } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { EditarInquilinoComponent } from '../modals/editar-inquilino/editar-inquilino.component';
import { VerInquilinoComponent } from '../modals/ver-inquilino/ver-inquilino.component';
import { EliminarInquilinoComponent } from '../modals/eliminar-inquilino/eliminar-inquilino.component';

@Component({
  selector: 'app-item-inquilino',
  standalone: true,
  imports: [MatDividerModule,MatButton,MatIconModule],
  templateUrl: './item-inquilino.component.html',
  styleUrl: './item-inquilino.component.scss'
})
export class ItemInquilinoComponent {
  @Input() inquilino!: IInquilino;
  constructor(private dialog: MatDialog) {}

  abrirModalVista() {
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Datos del Inquilino',
        componente: VerInquilinoComponent,
        componenteData: { inquilino: this.inquilino }
      }
    })
  }
  abrirModalEditar() {
    console.log(this.inquilino);
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Editar Inquilino',
        componente: EditarInquilinoComponent,
        componenteData: { inquilino: this.inquilino }
      }
    })
  }
  abrirModalEliminar() {
    this.dialog.open(ModalComponent, {
      data: {
        titulo: 'Eliminar Inquilino',
        componente: EliminarInquilinoComponent,
        componenteData: { inquilino: this.inquilino }
      }
    })

  }

}
