import { CaracteristicaEntidad } from './entity-base.interface';

export type EntidadConCaracteristicas = {
  caracteristicas: CaracteristicaEntidad[];
};

export function obtenerCaracteristica(
  entidad: EntidadConCaracteristicas,
  clave: string,
  valorPorDefecto: any = ''
): any {
  return entidad.caracteristicas.find(c => c.clave === clave)?.valor ?? valorPorDefecto;
}

export function construirCaracteristicasDesdeForm(
  form: { get: (clave: string) => { value: any } | null },
  claves: string[]
): CaracteristicaEntidad[] {
  return claves.map(clave => ({
    clave,
    valor: form.get(clave)?.value
  }));
}
