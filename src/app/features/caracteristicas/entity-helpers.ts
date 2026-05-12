import { FormGroup } from '@angular/forms';
import { CaracteristicaEntidad, IEntityBase } from './entity-base.interface';


export function obtenerCaracteristica(
  entidad: IEntityBase,
  clave: string,
  valorPorDefecto: string | number | boolean = ''
): string | number | boolean {
  return entidad.caracteristicas.find(c => c.clave === clave)?.valor ?? valorPorDefecto;
}

export function obtenerClavesCaracteristicas(entidad: IEntityBase): string[] {
  return entidad.caracteristicas.map(c => c.clave);
}


export function construirCaracteristicasDesdeForm(
  form: FormGroup
): CaracteristicaEntidad[] {
  const claves = Object.keys(form.controls).filter(key => key !== 'id');
  return claves.map(clave => ({
    clave,
    valor: form.controls[clave].value
  }));
}
