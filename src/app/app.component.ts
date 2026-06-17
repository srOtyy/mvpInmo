import { Component } from '@angular/core';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { HeadComponent } from './layout/head/head.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from "@angular/cdk/a11y";
import { ListaContratosComponent } from './features/contrato/lista-contratos/lista-contratos.component';
import { VistaInfoEntidadComponent } from './shared/vista-info-entidad/vista-info-entidad.component';
import { ContratoBbddService } from './features/contrato/contrato-bbdd.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, MainComponent, HeadComponent, MatButtonModule, MatSidenavModule, A11yModule, ListaContratosComponent, VistaInfoEntidadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  abrirSidenav: boolean = false;
  constructor(public _contratos: ContratoBbddService){}
  // el dia que empece fue el 1/12 ?
   eventoSidenav(){
    this.abrirSidenav = !this.abrirSidenav;
  }
 
}
