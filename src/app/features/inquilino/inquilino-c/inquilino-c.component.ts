import { Component } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
@Component({
  selector: 'app-inquilino-c',
  standalone: true,
  imports: [],
  templateUrl: './inquilino-c.component.html',
  styleUrl: './inquilino-c.component.scss'
})
export class InquilinoCComponent {
    inquilino!: IInquilino;
}
