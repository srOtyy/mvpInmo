import { Component } from '@angular/core';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';
import { VistaInfoEntidadComponent } from './shared/vista-info-entidad/vista-info-entidad.component';
import { ContratoBbddService } from './features/contrato/contrato-bbdd.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    SidebarComponent,
    MainComponent,
    MatButtonModule,
    MatSidenavModule,
    A11yModule,
    VistaInfoEntidadComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  abrirSidenav: boolean = false;
  constructor(
    public _contratos: ContratoBbddService,
    private router: Router,
  ) {}
  // el dia que empece fue el 1/12 ?
  eventoSidenav() {
    this.abrirSidenav = !this.abrirSidenav;
  }

  cerrarPanelesContrato() {
    this._contratos.$sideBarInfo.set(false);
    if (this.router.getCurrentNavigation() || !this.hayDetalleActivo()) return;

    this.router.navigate([
      '/contratos',
      { outlets: { primary: 'lista', detalle: null } },
    ]);
  }

  private hayDetalleActivo(): boolean {
    return this.router.routerState.snapshot.root.children.some((ruta) =>
      ruta.children.some((hija) => hija.outlet === 'detalle'),
    );
  }
}
