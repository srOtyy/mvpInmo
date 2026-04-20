import { Component, Input, OnInit } from '@angular/core';
import { IInmueble } from '../../inmueble.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InmueblesRxjsService } from '../../inmuebles-rxjs.service';
import { SnackbarService } from '../../../../core/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { construirCaracteristicasDesdeForm, obtenerClavesCaracteristicas } from '../../../caracteristicas/entity-helpers';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-editar-inmueble',
  standalone: true,
  imports: [MatFormField, MatInputModule,MatButton,ReactiveFormsModule],
  templateUrl: './editar-inmueble.component.html',
  styleUrl: './editar-inmueble.component.scss'
})
export class EditarInmuebleComponent implements OnInit {
  @Input() entidad!: IInmueble;
  formularioEditarInmueble: FormGroup;
  
   constructor( private formBuilder: FormBuilder, private _inmuebleRxJsService: InmueblesRxjsService, private dialogRef: MatDialogRef<ModalComponent>,private _snackbarService: SnackbarService){
      this.formularioEditarInmueble = this.formBuilder.group({});}
   
    ngOnInit(){
      this.pasarDatosInmueble(this.entidad);
    }
  
    pasarDatosInmueble(inmuebleData: IInmueble) {
       this.formularioEditarInmueble.patchValue({
        id: inmuebleData.id,
        idPropietario: inmuebleData.idPropietario
      }); 
  
      inmuebleData.caracteristicas.forEach(c => {
  
        this.formularioEditarInmueble.addControl(
          c.clave,
          new FormControl(c.valor)
        );
      });
    }
  
    guardarCambios() {  
     this._inmuebleRxJsService.actualizar(this.entidad.id, this.setInmuebleNuevo()).subscribe({
        next: () => {
          this._snackbarService.mensajeSnackBar('Inmueble editado con éxito', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: () => {
          this._snackbarService.mensajeSnackBar('Error al editar inquilino', 'Cerrar');
        }
      });
  }
  
    setInmuebleNuevo(): IInmueble{
      const inmuebleEditado: IInmueble = {
        id: this.formularioEditarInmueble.value.id,
        idPropietario: this.formularioEditarInmueble.value.idPropietario,
        caracteristicas: construirCaracteristicasDesdeForm(this.formularioEditarInmueble.value, obtenerClavesCaracteristicas(this.entidad))
      };
      return inmuebleEditado;
    }
}
