import { IEntityBase } from '../caracteristicas/entity-base.interface';

export interface IPropietario extends IEntityBase {
    listaInmuebles: number[]
}

export interface IPropietarioVista extends IPropietario{
    nombre: string
}