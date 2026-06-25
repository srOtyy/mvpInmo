import { Component, input } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { CommonModule,TitleCasePipe } from '@angular/common';



@Component({
  selector: 'app-vista-info-inquilino',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './vista-info-inquilino.component.html',
  styleUrl: './vista-info-inquilino.component.scss'
})
export class VistaInfoInquilinoComponent {
  inquilino = input<IInquilino | undefined>(undefined)

  

  
}
