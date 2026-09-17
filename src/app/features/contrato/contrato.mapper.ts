import {
  ContractStatus,
  EstadoRenovacion,
  IContrato,
  IContratoVista,
  tipoDeContrato,
} from './contrato.interface';
import { IPropietario } from '../propietario/propietario.interface';
import { obtenerNombre } from '../caracteristicas/entity-helpers';

interface estado {
  value: filtroEstadoContrato;
  viewValue: string;
}

interface estadoGrupo {
  tipoEstado: string;
  estados: estado[];
}
export interface filtroEstadoContrato {
  tipo: number;
  estado: ContractStatus | EstadoRenovacion | tipoDeContrato | 'todos';
}
export const estadosRenovacionYEstadosGenerales: estadoGrupo[] = [
  {
    tipoEstado: 'Sin filtro',
    estados: [{ value: { tipo: 0, estado: 'todos' }, viewValue: 'Todos' }],
  },
  {
    tipoEstado: 'Proximo aumento',
    estados: [
      { value: { tipo: 2, estado: 'un_mes' }, viewValue: '1 mes' },
      { value: { tipo: 2, estado: 'dos_meses' }, viewValue: '2 meses' },
      { value: { tipo: 2, estado: 'normal' }, viewValue: 'Normal' },
      { value: { tipo: 2, estado: 'vencido' }, viewValue: 'Vencido' },
    ],
  },
  {
    tipoEstado: 'Estado de general',
    estados: [
      { value: { tipo: 1, estado: 'activo' }, viewValue: 'Activo' },
      { value: { tipo: 1, estado: 'preliminar' }, viewValue: 'Preliminar' },
      { value: { tipo: 1, estado: 'finalizado' }, viewValue: 'Finalizado' },
    ],
  },
  {
    tipoEstado: 'Tipo de contrato',
    estados: [
      {
        value: { tipo: 3, estado: 'viviendaPermanente' },
        viewValue: 'Vivienda permanente',
      },
      {
        value: { tipo: 3, estado: 'temporadaInvierno' },
        viewValue: 'Temporada invierno',
      },
      { value: { tipo: 3, estado: 'comercial' }, viewValue: 'Comercial' },
    ],
  },
];
export function toContratoVista(
  contrato: IContrato,
  propietarios: IPropietario[],
): IContratoVista {
  const propietario = propietarios.find((p) => p.id === contrato.propietarioId);
  const propietarioNombre = propietario
    ? obtenerNombre(propietario)
    : 'Nombre no disponible';
  return {
    ...contrato,
    propietarioNombre,
  };
}

export function toContratosVista(
  contratos: IContrato[],
  propietarios: IPropietario[],
): IContratoVista[] {
  return contratos.map((contrato) => toContratoVista(contrato, propietarios));
}
