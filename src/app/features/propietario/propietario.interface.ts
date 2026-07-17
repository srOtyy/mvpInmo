import { IEntityBase } from '../caracteristicas/entity-base.interface';

export interface IPropietario extends IEntityBase {}

export interface IPropietarioVista extends IPropietario{
    nombre: string
}