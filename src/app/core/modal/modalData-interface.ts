import { Type } from "@angular/core";
//(*excepcion 1)any autorizado 100%. La interfaz ModalData acepta como componente cualquier tipo de componente, por lo que no es necesario especificar un tipo concreto. Además, el método abrirModal es genérico, lo que permite que el tipo de datos del componente sea flexible y se adapte a las necesidades de cada caso.
export interface ModalData<T> {
  titulo: string;
  componente: Type<any>;
  componenteData: T
}