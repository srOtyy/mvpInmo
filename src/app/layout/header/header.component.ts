import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
import { IBotonRuta } from '../../core/navegacion/navegacionRutas';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  botones: IBotonRuta[] = []


  constructor(private _serviceRutas: RutasDinamicasService) {
    this._serviceRutas.arrayBotones$.subscribe((botones) => {
      this.botones = botones; 
    })

    
  }

}
