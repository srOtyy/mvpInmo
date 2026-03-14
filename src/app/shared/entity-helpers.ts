import { FormGroup } from '@angular/forms';
import { CaracteristicaEntidad } from './entity-base.interface';

export type EntidadConCaracteristicas = {
  caracteristicas: CaracteristicaEntidad[];
};

export function obtenerCaracteristica(
  entidad: EntidadConCaracteristicas,
  clave: string,
  valorPorDefecto: string | number | boolean  = ''
): string | number | boolean  {
  for(const caracteristica of entidad.caracteristicas) {
    if(caracteristica.clave === clave) {
      return caracteristica.valor;
    }
  }
  console.log('Valor no encontrado para clave:', clave);
  return valorPorDefecto;
}

export function construirCaracteristicasDesdeForm(
  form: FormGroup,
): CaracteristicaEntidad[] {
  const claves = Object.keys(form.controls).filter(key => key !== 'id');
  return claves.map(clave => ({
    clave,
    valor: form.controls[clave].value
  }));
}
