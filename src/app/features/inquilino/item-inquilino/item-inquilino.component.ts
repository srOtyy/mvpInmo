import { Component, Input } from '@angular/core';
import { IInquilino } from '../inquilino.interface';
import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item-inquilino',
  standalone: true,
  imports: [MatDividerModule,MatButton,MatIconModule],
  templateUrl: './item-inquilino.component.html',
  styleUrl: './item-inquilino.component.scss'
})
export class ItemInquilinoComponent {
  @Input() inquilino!: IInquilino;
  constructor(private dialog: MatDialog) { }

}
