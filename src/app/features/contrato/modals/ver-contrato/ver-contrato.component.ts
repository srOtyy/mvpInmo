import { Component, Input, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { IContrato } from '../../contrato.interface';
import { DatePipe, CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-ver-contrato',
  standalone: true,
  imports: [MatDividerModule,DatePipe,CurrencyPipe],
  templateUrl: './ver-contrato.component.html',
  styleUrl: './ver-contrato.component.scss'
})
export class VerContratoComponent {
  @Input() entidad!: IContrato;
  //acutalmente tendre que hardcodear el contrato, pero luego se puede agregar un servicio para obtenerlo
}
