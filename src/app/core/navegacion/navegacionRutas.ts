export interface IBotonRuta {
  nombre: string;
  ruta: string[];
}

//agregar futuros dominios en este union type
export type Dominio = 'propietarios' | 'inquilinos';