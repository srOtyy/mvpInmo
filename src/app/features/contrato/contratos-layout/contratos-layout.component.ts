import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { ContratoBbddService } from '../contrato-bbdd.service';

@Component({
  selector: 'app-contratos-layout',
  imports: [MatSidenavModule, RouterOutlet],
  templateUrl: './contratos-layout.component.html',
  styleUrl: './contratos-layout.component.scss',
})
export class ContratosLayoutComponent {
  detalleAbierto = signal(false);

  constructor(
    private router: Router,
    private contratosService: ContratoBbddService,
  ) {}

  cerrarDetalle() {
    this.contratosService.$sideBarInfo.set(false);
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
