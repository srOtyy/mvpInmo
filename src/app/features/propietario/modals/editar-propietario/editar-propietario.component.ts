import { Component, Input, OnInit,  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPropietario } from '../../propietario.interface';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { PropietarioRxjsService } from '../../propietario-rxjs.service';
import { SnackbarService } from '../../../../core/snackbar.service';
import { construirCaracteristicasDesdeForm, obtenerCaracteristica } from '../../../../shared/entity-helpers';
@Component({
  selector: 'app-editar-propietario',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButton],
  templateUrl: './editar-propietario.component.html',
  styleUrl: './editar-propietario.component.scss'
})
export class EditarPropietarioComponent implements OnInit{
  //Setear los datos del propietario en el formulario fuera del constructor ya que los datos vienen por input (MAT_DIALOG_DATA)

  @Input() entidad!: IPropietario;
  formularioEditarPropietario: FormGroup;
  
  constructor( 
    private formBuilder: FormBuilder,
    private _propietarioRxJsService: PropietarioRxjsService,
    private dialogRef: MatDialogRef<ModalComponent>,
    private _snackbarService: SnackbarService)
    {
      this.formularioEditarPropietario = this.formBuilder.group({
      id: new FormControl('', [Validators.required])
      });
    }

  ngOnInit() {
    this.pasarDatosPropietario(this.entidad);
  }

  pasarDatosPropietario(propietarioData: IPropietario) {

    this.formularioEditarPropietario.patchValue({
      id: propietarioData.id
    });

    propietarioData.caracteristicas.forEach(c => {

      this.formularioEditarPropietario.addControl(
        c.clave,
        new FormControl(c.valor)
      );

    });

  }

  guardarCambios() {  
    this._propietarioRxJsService.actualizarPropietario(this.setPropietarioNuevo()).subscribe({
      next: () => {
        this._snackbarService.mensajeSnackBar('Propietario editado con éxito', 'Cerrar');
        this.dialogRef.close(true);
      },
      error: () => {
        this._snackbarService.mensajeSnackBar('Error al editar propietario', 'Cerrar');
      }
    });
  }
  setPropietarioNuevo(): IPropietario{
    const propietarioEditado: IPropietario = {
       id: this.formularioEditarPropietario.value.id,
      caracteristicas: construirCaracteristicasDesdeForm(this.formularioEditarPropietario)
    };  
    return propietarioEditado;
  }

}

