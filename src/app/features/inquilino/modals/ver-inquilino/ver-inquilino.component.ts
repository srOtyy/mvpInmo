import { Component, Input } from '@angular/core';
import { IInquilino } from '../../inquilino.interface';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-ver-inquilino',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './ver-inquilino.component.html',
  styleUrl: './ver-inquilino.component.scss'
})
export class VerInquilinoComponent {
  @Input() entidad!: IInquilino;
}
