import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InquilinoRxjsService } from '../inquilino-rxjs.service';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { SnackbarService } from '../../../core/snackbar.service';
import { CaracteristicaEntidad } from '../../caracteristicas/entity-base.interface';
import { randomId } from '../../../shared/utilitys';
import { GarantesService } from '../../garantes/garantes.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import {FormControl} from '@angular/forms';
import { IInquilino } from '../inquilino.interface';
import { Garante } from '../../garantes/garante-interface';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-crear-inquilino',
  standalone: true,
  imports: [FormDinamicoComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatDivider, MatIconModule,  FormsModule, ReactiveFormsModule],
  templateUrl: './crear-inquilino.component.html',
  styleUrl: './crear-inquilino.component.scss'
})
export class CrearInquilinoComponent {
  garantesAux: Garante[] = [];
  habilitarTerminarCreacion: boolean = false;
  cambiarColorbotones: boolean = false;
  inquilinoAux: IInquilino = {
    id: 0,
    caracteristicas: [],
    garantes: []
  }
  formularioGarante: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl('')
  });
  constructor(
    private _inquilinosService: InquilinoRxjsService,
    private _snack: SnackbarService,
    private _garantes: GarantesService    
  ) {
    this.formularioGarante.get('nombre')?.disable();
    this.formularioGarante.get('email')?.disable();
    this.formularioGarante.get('telefono')?.disable();
  }
  // boton submit form dinamico
  onEntidadCreada(entidad: { caracteristicas: CaracteristicaEntidad[] }): void {
    const nuevoInquilino = {
      id: randomId(),
      caracteristicas: entidad.caracteristicas,
      garantes: [] 
    };
    this.inquilinoAux = nuevoInquilino;
    this.formularioGarante.get('nombre')?.enable();
    this.formularioGarante.get('email')?.enable();
    this.formularioGarante.get('telefono')?.enable();
    this.cambiarColorbotones = true;
  } 
  //boton submit form garante
  finalizarCreacionGarantes(id: number){
    this.agregarGarante(id);
    this.habilitarTerminarCreacion = true;

  }
  //boton agregar otro garante 
  agregarGarante(id: number){
    const garante = this._garantes.crearGarante(id, this.formularioGarante.controls['nombre'].value, this.formularioGarante.controls['telefono'].value, this.formularioGarante.controls['email'].value);
    this.garantesAux.push(garante);
    this._snack.mensajeSnackBar('Garante agregado exitosamente', 'Cerrar');
    this.formularioGarante.reset();
    this.formularioGarante.markAsTouched();
  }
  // finalizar creacion inquilino con garantes ( ambos formularios)
  terminarCreacion(){
    const inquilinoConGarantes = this._garantes.agregarGarantesalInquilino(this.inquilinoAux, this.garantesAux);
    this.enviarInquilinoABD(inquilinoConGarantes);
    this._snack.mensajeSnackBar('Inquilino creado exitosamente', 'Cerrar');
    this.habilitarTerminarCreacion = false;
  }
  private enviarInquilinoABD(inquilino: IInquilino) {
    this._inquilinosService.crear(inquilino).subscribe({
      next: () => {
        this._snack.mensajeSnackBar('Inquilino creado exitosamente', 'Cerrar');
      },
      error: (error) => {
        this._snack.mensajeSnackBar('Error al crear inquilino', 'Cerrar');
      }
    });
  }
}
