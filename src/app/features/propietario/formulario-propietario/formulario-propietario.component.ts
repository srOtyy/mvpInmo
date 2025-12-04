import { Component } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-formulario-propietario',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './formulario-propietario.component.html',
  styleUrl: './formulario-propietario.component.scss'
})
export class FormularioPropietarioComponent {

}
