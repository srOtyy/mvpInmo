  import { Component } from '@angular/core';
  import { FormularioCaracteristicasComponent } from '../../../shared/formulario-caracteristicas/formulario-caracteristicas.component';

  @Component({
    selector: 'app-formulario-creacion',
    standalone: true,
    imports: [FormularioCaracteristicasComponent],
    templateUrl: './formulario-creacion.component.html',
    styleUrl: './formulario-creacion.component.scss'
  })
  export class FormularioCreacionComponent {
    constructor() {}
  }
