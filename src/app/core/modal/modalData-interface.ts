import { Type } from "@angular/core";

export interface ModalData<T> {
  title: string;
  componente: Type<any>;
  componenteData: T
}