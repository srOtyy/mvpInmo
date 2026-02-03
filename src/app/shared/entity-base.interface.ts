export interface IEntityBase {
  id: number;
  caracteristicas: CaracteristicaEntidad[];
}

export interface CaracteristicaEntidad {
  clave: string;
  valor: any;
}
