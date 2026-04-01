import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IInmueble } from './inmueble.interface';
import { BaseCrudService } from '../../core/http/base-crud.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class InmueblesRxjsService extends BaseCrudService<IInmueble> {
 
  constructor( http: HttpClient ) {
    super(http, 'http://localhost:3000/inmuebles')
   }

}
