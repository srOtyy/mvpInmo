import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
import { Dominio } from '../../core/navegacion/navegacionRutas';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // obtiene los dominios activos desde el servicio de core: rutas-dinamicas.service.ts
  dominiosActivos: string[] = [];
  constructor(private rutasDinamicasService: RutasDinamicasService) {
    this.dominiosActivos = this.rutasDinamicasService.emitirEntidades();
  }

  enviarDominio(dominio: string): void {
    this.rutasDinamicasService.enviarDominioActivo(dominio as Dominio);
  }
}
