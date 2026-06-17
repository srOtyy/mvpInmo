import { Component, input } from '@angular/core';
import { IInquilino } from '../inquilino.interface';

@Component({
  selector: 'app-vista-info-inquilino',
  standalone: true,
  imports: [],
  templateUrl: './vista-info-inquilino.component.html',
  styleUrl: './vista-info-inquilino.component.scss'
})
export class VistaInfoInquilinoComponent {
  inquilino = input<IInquilino | undefined>(undefined)
}
