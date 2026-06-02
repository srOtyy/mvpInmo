import { Component, output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
import { Dominio, IBotonRuta } from '../../core/navegacion/navegacionRutas';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  evento = output<void>();
  // no se si estoy agarrando el valor del signal y lo asigno a la variable o si directamente uso el signal en el html, lo que si se es que el signal no se puede usar en el html, por eso lo asigno a la variable dominioActivo, pero no se si es la mejor forma de hacerlo
  dominiosActivos: string[] = [];
  dominioActivo: Dominio | null = null;
  constructor(
    private rutasDinamicasService: RutasDinamicasService
  ) {
    this.rutasDinamicasService.emitirEntidades().forEach(dominio => {
      this.dominiosActivos.push(dominio);
    });
    
  }
  cerrarSidenavEvent() {
    this.enviarDominio(null)
    this.evento.emit();
  }
  enviarDominio(dominio: string | null): void {
    this.rutasDinamicasService.$dominioActivo.set(dominio as Dominio);
  }
  consultarDominioActivo(dominio: string): boolean {
    return this.rutasDinamicasService.$dominioActivo() === dominio;
  }
  obtenerBotonesDeAccion(dominio: string): IBotonRuta[] {
    return this.rutasDinamicasService.obtenerBotonesAccionPorDominio(dominio as Dominio);
  }
}
