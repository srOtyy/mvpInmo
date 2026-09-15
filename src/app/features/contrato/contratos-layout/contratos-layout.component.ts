import { Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contratos-layout',
  imports: [MatSidenavModule, RouterOutlet],
  templateUrl: './contratos-layout.component.html',
  styleUrl: './contratos-layout.component.scss',
})
export class ContratosLayoutComponent {
  detalleAbierto = signal(false);

  constructor(private router: Router) {}

  cerrarDetalle() {
    this.router.navigate([
      '/contratos',
      { outlets: { primary: 'lista', detalle: null } },
    ]);
  }
}
