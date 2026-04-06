import { Injectable } from '@angular/core';
import { IInquilino } from './inquilino.interface';
import { HttpClient } from '@angular/common/http';
import { BaseCrudService } from '../../core/http/base-crud.service';
@Injectable({
  providedIn: 'root'
})
export class InquilinoRxjsService extends BaseCrudService<IInquilino> {
  constructor( http: HttpClient ) {
    super(http, 'http://localhost:3000/inquilinos')
  }
  
}
