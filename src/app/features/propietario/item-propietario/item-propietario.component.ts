import { Component, Input } from '@angular/core';
import { IPropietario } from '../propietario.interface';
import {MatDividerModule} from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-item-propietario',
  standalone: true,
  imports: [MatDividerModule,MatButton,MatIconModule],
  templateUrl: './item-propietario.component.html',
  styleUrl: './item-propietario.component.scss'
})
export class ItemPropietarioComponent {

    @Input() propietario!: IPropietario;
}
