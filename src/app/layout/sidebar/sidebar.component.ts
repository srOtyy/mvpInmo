import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
import { Dominio, IBotonRuta } from '../../core/navegacion/navegacionRutas';

@Component({
  selector: 'app-sidebar',
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  readonly navegacionSeleccionada = output<void>();
  readonly dominiosActivos: Dominio[];
  private readonly etiquetasDominios: Record<
    Dominio,
    { etiqueta: string; icono: string }
  > = {
    contratos: { etiqueta: 'Contratos', icono: 'description' },
    inmuebles: { etiqueta: 'Inmuebles', icono: 'apartment' },
    inquilinos: { etiqueta: 'Inquilinos', icono: 'people_alt' },
    propietarios: { etiqueta: 'Propietarios', icono: 'key' },
  };
  private readonly etiquetasAcciones: Record<
    string,
    { etiqueta: string; icono: string }
  > = {
    lista: { etiqueta: 'Listado', icono: 'view_list' },
    crear: { etiqueta: 'Crear nuevo', icono: 'add_circle_outline' },
    caracteristicas: { etiqueta: 'Características', icono: 'tune' },
  };

  constructor(
    private readonly rutasDinamicasService: RutasDinamicasService,
    private readonly router: Router,
  ) {
    this.dominiosActivos = this.rutasDinamicasService.emitirEntidades();
    this.actualizarDominioActivo(this.router.url);
    this.router.events
      .pipe(
        filter(
          (evento): evento is NavigationEnd => evento instanceof NavigationEnd,
        ),
        takeUntilDestroyed(),
      )
      .subscribe((evento) =>
        this.actualizarDominioActivo(evento.urlAfterRedirects),
      );
  }

  alternarDominio(dominio: Dominio): void {
    const dominioActual = this.rutasDinamicasService.$dominioActivo();
    this.rutasDinamicasService.$dominioActivo.set(
      dominioActual === dominio ? null : dominio,
    );
  }

  consultarDominioActivo(dominio: Dominio): boolean {
    return this.rutasDinamicasService.$dominioActivo() === dominio;
  }

  obtenerBotonesDeAccion(dominio: Dominio): IBotonRuta[] {
    return this.rutasDinamicasService.obtenerBotonesAccionPorDominio(dominio);
  }

  obtenerEtiquetaDominio(dominio: Dominio): string {
    return this.etiquetasDominios[dominio].etiqueta;
  }

  obtenerIconoDominio(dominio: Dominio): string {
    return this.etiquetasDominios[dominio].icono;
  }

  obtenerEtiquetaAccion(accion: string): string {
    return this.etiquetasAcciones[accion]?.etiqueta ?? accion;
  }

  obtenerIconoAccion(accion: string): string {
    return this.etiquetasAcciones[accion]?.icono ?? 'arrow_forward';
  }

  seleccionarAccion(dominio: Dominio): void {
    this.rutasDinamicasService.$dominioActivo.set(dominio);
    this.navegacionSeleccionada.emit();
  }

  seleccionarInicio(): void {
    this.rutasDinamicasService.$dominioActivo.set('contratos');
    this.navegacionSeleccionada.emit();
  }

  private actualizarDominioActivo(url: string): void {
    const primerSegmento = url.split('?')[0].split('/')[1]?.split(';')[0];
    const dominioActivo =
      this.dominiosActivos.find((dominio) => dominio === primerSegmento) ?? null;
    this.rutasDinamicasService.$dominioActivo.set(dominioActivo);
  }
}
