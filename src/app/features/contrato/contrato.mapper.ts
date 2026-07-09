import { IContrato, IContratoVista } from './contrato.interface';
import { IPropietario } from '../propietario/propietario.interface';
import { obtenerNombre } from '../caracteristicas/entity-helpers';

export function toContratoVista(contrato: IContrato, propietarios: IPropietario[]): IContratoVista {
  const propietario = propietarios.find(p => p.id === contrato.propietarioId);
  const propietarioNombre = propietario ? obtenerNombre(propietario) : 'Nombre no disponible';
  return {
    ...contrato,
    propietarioNombre,
  };
}

export function toContratosVista(contratos: IContrato[], propietarios: IPropietario[]): IContratoVista[] {
  return contratos.map(contrato => toContratoVista(contrato, propietarios));
}
