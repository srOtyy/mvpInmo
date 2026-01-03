import { Component } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { CardListComponent } from '../../../shared/card-list/card-list.component';
import { ItemInquilinoComponent } from '../item-inquilino/item-inquilino.component';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-inquilino-c',
  standalone: true,
  imports: [CardListComponent,ItemInquilinoComponent, MatButton],
  templateUrl: './inquilino-c.component.html',
  styleUrl: './inquilino-c.component.scss'
})

export class InquilinoCComponent {
  inquilino!: IInquilino;
  listaInquilinos: IInquilino[] = [];

  constructor( private _inquilinosService: InquilinoRxjsService ){
    this._inquilinosService.listaInquilinos$.subscribe(inquilinos => {
      this.listaInquilinos = inquilinos;
    })
  }

  crearInquilino(){
    this.inquilino = {
      id: this.randomId(),
      nombre: 'Ana',
      dni: 87654321,
      telefono: 9876543210,
      email: 'ana@ana',
      garante: 'Garantia XYZ',
      ingresos: 50000
    }
    this._inquilinosService.agregarInquilino(this.inquilino);
  }
  randomId(): number{
    return Math.floor(Math.random() * 1000) + 1;
  }
}
