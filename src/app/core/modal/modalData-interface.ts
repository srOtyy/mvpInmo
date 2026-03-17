import { Type } from "@angular/core";

export interface ModalData<T> {
  titulo: string;
  componente: Type<any>;
  componenteData: T
}