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
  
  constructor( private formBuilder: FormBuilder, private _propietarioRxJsService: PropietarioRxjsService, private dialogRef: MatDialogRef<ModalComponent>,private _snackbarService: SnackbarService){
    this.formularioEditarPropietario = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cbu: new FormControl('', [Validators.required]),
      inmuebles: new FormControl([],[])
    });
  }
  ngOnInit() {
    this.pasarDatosPropietario(this.entidad);
  }

  pasarDatosPropietario(propietarioData: IPropietario) {
    this.formularioEditarPropietario.setValue({
      id: propietarioData.id,
      nombre: obtenerCaracteristica(propietarioData, 'nombre'),
      dni: obtenerCaracteristica(propietarioData, 'dni'),
      telefono: obtenerCaracteristica(propietarioData, 'telefono'),
      email: obtenerCaracteristica(propietarioData, 'email'),
      cbu: obtenerCaracteristica(propietarioData, 'cbu'),
      inmuebles: obtenerCaracteristica(propietarioData, 'inmuebles', [])
    });
  }

  guardarCambios() {  
    const propietarioEditado: IPropietario = {
      id: this.formularioEditarPropietario.get('id')?.value,
      caracteristicas: construirCaracteristicasDesdeForm(this.formularioEditarPropietario, [
        'nombre',
        'dni',
        'telefono',
        'email',
        'cbu',
        'inmuebles'
      ])
    };
    this._propietarioRxJsService.editarPropietario(propietarioEditado)
    this._snackbarService.mensajeSnackBar('Propietario editado con Ã©xito', 'Cerrar');
    this.dialogRef.close(true);
  }
  
}
