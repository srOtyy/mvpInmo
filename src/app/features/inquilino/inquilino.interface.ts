import { IEntityBase } from '../caracteristicas/entity-base.interface';
import { Garante } from '../garantes/garante-interface';

export interface IInquilino extends IEntityBase {
    garantes: Garante[];
}

export interface IInquilinoVista extends IInquilino{
    nombre: string;
}