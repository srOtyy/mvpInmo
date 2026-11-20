import { Component } from '@angular/core';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { VistaInfoEntidadComponent } from './shared/vista-info-entidad/vista-info-entidad.component';
import { ContratoBbddService } from './features/contrato/contrato-bbdd.service';

@Component({
  selector: 'app-root',
  imports: [
    SidebarComponent,
    MainComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    A11yModule,
    VistaInfoEntidadComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  menuMovilAbierto = false;
  constructor(public _contratos: ContratoBbddService) {}
  // el dia que empece fue el 1/12 ?
  alternarMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }

  cerrarMenuMovil() {
    this.menuMovilAbierto = false;
  }

  cerrarInfoContrato() {
    this._contratos.$sideBarInfo.set(false);
  }
}
