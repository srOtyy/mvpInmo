import { Injectable } from '@angular/core';
import { IPropietario } from './propietario.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
@Injectable({
  providedIn: 'root'
})
export class PropietarioRxjsService extends BaseCrudService<IPropietario> {

  constructor(http: HttpClient) { 
    super(http, 'http://localhost:3000/propietarios')
  }

  
}
