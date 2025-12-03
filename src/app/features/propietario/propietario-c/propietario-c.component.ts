import { Component } from '@angular/core';
import { IPropietario } from '../propietario.interface';

@Component({
  selector: 'app-propietario-c',
  standalone: true,
  imports: [],
  templateUrl: './propietario-c.component.html',
  styleUrl: './propietario-c.component.scss'
})
export class PropietarioCComponent {
  propietario!: IPropietario;

  constructor(){
    this.propietario = {
      id: 3,
      nombre: 'Carlos',
      dni: 33445566,
      telefono: 1122334455,
      email: "p@onabort.com",
      cbu: "3344556677889900112233",  
    }
  }
}
