import { TestBed } from '@angular/core/testing';

import { EglaiService } from './eglai.service';

describe('EglaiService', () => {
  let service: EglaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EglaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
