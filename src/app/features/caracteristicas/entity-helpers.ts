import { CaracteristicaEntidad } from './entity-base.interface';

export type EntidadConCaracteristicas = {
  caracteristicas: CaracteristicaEntidad[];
};

export function obtenerCaracteristica(
  entidad: EntidadConCaracteristicas,
  clave: string,
  valorPorDefecto: string | number | boolean = ''
): string | number | boolean {
  return entidad.caracteristicas.find(c => c.clave === clave)?.valor ?? valorPorDefecto;
}
export function obtenerClavesCaracteristicas(entidad: EntidadConCaracteristicas): string[] {
  return entidad.caracteristicas.map(c => c.clave);
}


export function construirCaracteristicasDesdeForm(
  form: { get: (clave: string) => { value: string | number | boolean } | null },
  claves: string[] 
): CaracteristicaEntidad[] {
  return claves.map(clave => ({
    clave,
    valor: form.get(clave)?.value ?? ''
  }));
}
