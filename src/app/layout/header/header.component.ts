import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton} from '@angular/material/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  listaBotones = [
    { nombre: 'lista', ruta: 'propietarios/lista' },
    { nombre: 'crear', ruta: 'propietarios/crear' }
  ];

}
