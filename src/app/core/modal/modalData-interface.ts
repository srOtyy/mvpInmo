import { Type } from "@angular/core";
export interface ModalContentComponent<T> {
  entidad?: T;
}

export interface SimpleModalData<T> {
  titulo: string;
  componente: Type<any>;
  componenteData: T;
}