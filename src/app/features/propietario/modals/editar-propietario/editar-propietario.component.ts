import { Component, Input,  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPropietario } from '../../propietario.interface';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { PropietarioRxjsService } from '../../propietario-rxjs.service';
import { SnackbarService } from '../../../../core/snackbar.service';
@Component({
  selector: 'app-editar-propietario',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButton],
  templateUrl: './editar-propietario.component.html',
  styleUrl: './editar-propietario.component.scss'
})
export class EditarPropietarioComponent {
  //Setear los datos del propietario en el formulario fuera del constructor ya que los datos vienen por input (MAT_DIALOG_DATA)

  @Input() propietario!: IPropietario;
  formularioEditarPropietario: FormGroup;
  
  constructor( private formBuilder: FormBuilder, private _propietarioRxJsService: PropietarioRxjsService, private dialogRef: MatDialogRef<ModalComponent>,private _snackbarService: SnackbarService){
    this.formularioEditarPropietario = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cbu: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit() {
    this.pasarDatosPropietario(this.propietario);
  }
  
  pasarDatosPropietario(propietarioData: IPropietario) {
    this.formularioEditarPropietario.setValue({
      id: propietarioData.id,
      nombre: propietarioData.nombre,
      dni: propietarioData.dni,
      telefono: propietarioData.telefono,
      email: propietarioData.email,
      cbu: propietarioData.cbu,
    });
  }

  guardarCambios() {  
    this._propietarioRxJsService.editarPropietario(this.formularioEditarPropietario.value)
    this._snackbarService.mensajeSnackBar('Propietario editado con éxito', 'Cerrar');
    this.dialogRef.close(true);
  }
  
}
