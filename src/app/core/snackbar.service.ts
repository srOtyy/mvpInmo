import { inject, Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);
  mensajeSnackBar(mensaje: string, accion: string) {
    this._snackBar.open(mensaje, accion,{
      panelClass: ['snackbar-color']
    });
  }
}
