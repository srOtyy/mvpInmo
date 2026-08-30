import { TestBed } from '@angular/core/testing';

import { ListaDeContratosService } from './lista-de-contratos.service';

describe('ListaDeContratosService', () => {
  let service: ListaDeContratosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaDeContratosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
