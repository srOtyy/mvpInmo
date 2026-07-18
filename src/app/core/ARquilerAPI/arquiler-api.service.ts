import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

// es el body de la peticion a la API
export interface ArquilerApiCalculateRequest {
  amount: number;
  date: string;
  months: number;
  rate: string;
}
// es la resputa de la API
export interface ArquilerApiCalculateResponse {
  success: boolean;
  data: ArquilerApiCalculateResult[];
}

export interface ArquilerApiCalculateResult {
  date: string;
  value: number;
  estimated: boolean;
  dif: number;
  amount: number;
  details: ArquilerApiCalculateDetail[];
}


export interface ArquilerApiCalculateDetail {
  date: string;
  value: number;
  month_before: number;
  accumulate: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArquilerApiService {
  TemporalArquilerApliCalculateResponse: ArquilerApiCalculateResponse = {
    success: true,
    data: [{date: 'string', value: 0, estimated: true, dif: 0, amount: 0, details: [{date: '', value: 0,month_before:0,accumulate:0}]}]
  }


  private readonly baseUrl = environment.rapidApi.baseUrl;
  private readonly apiHost = environment.rapidApi.host;
  private readonly apiKey = environment.rapidApi.key;

  constructor(private http: HttpClient) {}

  private buildHeaders(): HttpHeaders {
    // Estos headers son los que RapidAPI espera .
    return new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': this.apiHost,
      'Content-Type': 'application/json'
    });
  }

    calcularActualizacion(
      payload: ArquilerApiCalculateRequest
    ): Observable<ArquilerApiCalculateResponse> {
    // Usamos POST porque la API recibe un cuerpo JSON con los datos del cálculo.
    return this.http
      .post<ArquilerApiCalculateResponse>(
        `${this.baseUrl}/calculate`,
        payload,
        { headers: this.buildHeaders() }
      )
      .pipe(
        catchError((error) => {
          // Convertimos el error crudo del HttpClient en un mensaje más fácil de leer.
          const message =
            error?.error?.message ??
            error?.message ??
            'No se pudo completar la petición a ArquilerAPI';

          return throwError(() => new Error(message));
        })
      );
  }
}
