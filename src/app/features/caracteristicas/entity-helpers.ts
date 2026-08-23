import { FormGroup } from '@angular/forms';
import { CaracteristicaEntidad, IEntityBase } from './entity-base.interface';

export function obtenerCaracteristica(
  entidad: IEntityBase,
  clave: string,
  valorPorDefecto: string | number | boolean = '',
): string | number | boolean {
  return (
    entidad.caracteristicas.find((c) => c.clave === clave)?.valor ??
    valorPorDefecto
  );
}
export function obtenerNombre(entidad: IEntityBase): string {
  return obtenerCaracteristica(entidad, 'nombre', 'Sin nombre') as string;
}

export function obtenerClavesCaracteristicas(entidad: IEntityBase): string[] {
  return entidad.caracteristicas.map((c) => c.clave);
}

export function construirCaracteristicasDesdeForm(
  form: FormGroup,
): CaracteristicaEntidad[] {
  const claves = Object.keys(form.controls).filter(
    // lastimosamente tuve q hardcodear esto porque esta agregando ciertas 'caracteristcas' que no deberian estar ahí
    // espero pronto poder cambiar esto
    (key) =>
      key !== 'id' &&
      key !== 'activo' &&
      key !== 'idPropietario' &&
      key !== 'direccion',
  );
  return claves.map((clave) => ({
    clave,
    valor: form.controls[clave].value,
  }));
}
