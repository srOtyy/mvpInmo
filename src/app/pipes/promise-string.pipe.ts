import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'promiseString',
  standalone: true
})
export class PromiseStringPipe implements PipeTransform {
  transform(value: Promise<string> | string | null | undefined): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    // Para Promise, retorna vacío mientras se resuelve (se actualizará cuando se resuelva)
    return '';
  }
}
