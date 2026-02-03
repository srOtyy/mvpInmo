import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from "@angular/router";
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // obtiene los dominios activos desde el servicio de core: rutas-dinamicas.service.ts
  dominiosActivos: string[] = [];
  constructor(private rutasDinamicasService: RutasDinamicasService) {
    this.rutasDinamicasService.emitirEntidades().forEach(dominio => {
      this.dominiosActivos.push(dominio);
    });
  }
}
