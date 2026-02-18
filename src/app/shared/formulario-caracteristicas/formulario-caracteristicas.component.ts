import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
import { Dominio } from '../../core/navegacion/navegacionRutas';
import { DefinicionCaracteristica } from '../definicion-caracteristica.interface';
import { DefinicionesCaracteristicasService } from '../definiciones-caracteristicas.service';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-formulario-caracteristicas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './formulario-caracteristicas.component.html',
  styleUrl: './formulario-caracteristicas.component.scss'
})
export class FormularioCaracteristicasComponent implements OnInit, OnDestroy {
  private dominioSub?: Subscription; 
  
  // El dominioSub es una suscripción a un observable que emite cambios en el dominio activo. Esto permite que el componente reaccione dinámicamente a los cambios en el dominio, actualizando las definiciones de características en consecuencia. Es necesario para mantener la sincronización entre el estado del dominio y las definiciones de características mostradas en el formulario, asegurando que los usuarios siempre vean la información relevante para el contexto actual.

  dominioActivo: Dominio | null = null;
  // El dominio activo se obtiene a través del servicio de rutas dinámicas, lo que permite que el componente se adapte al contexto actual de la aplicación

  @Output() definicionSubmit = new EventEmitter<{
    dominio: Dominio;
    definiciones: DefinicionCaracteristica[];
  }>();

  definiciones: DefinicionCaracteristica[] = [];
  tipos: DefinicionCaracteristica['tipo'][] = ['texto', 'numero', 'booleano'];

  formularioCaracteristicas: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private rutasDinamicasService: RutasDinamicasService,
    private definicionesService: DefinicionesCaracteristicasService
  ) {
    this.formularioCaracteristicas = this.formBuilder.group({
      clave: new FormControl('', Validators.required),
      tipo: new FormControl<DefinicionCaracteristica['tipo']>('texto', Validators.required),
      requerido: new FormControl(false)
    });
  }

  ngOnInit(): void {
    this.dominioActivo = this.rutasDinamicasService.getDominioActivo();
    if (this.dominioActivo) {
      this.definiciones = this.definicionesService.getDefiniciones(this.dominioActivo);
    }

    this.dominioSub = this.rutasDinamicasService.dominioActivo$.subscribe(dominio => {
      this.dominioActivo = dominio;
      if (dominio) {
        this.definiciones = this.definicionesService.getDefiniciones(dominio);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopDominioSub();
  }

  agregarDefinicion(): void {
    if (this.formularioCaracteristicas.invalid) {
      return;
    }

    const nuevaDefinicion: DefinicionCaracteristica = {
      clave: this.formularioCaracteristicas.get('clave')?.value,
      tipo: this.formularioCaracteristicas.get('tipo')?.value,
      requerido: this.formularioCaracteristicas.get('requerido')?.value
    };

    this.definiciones = [...this.definiciones, nuevaDefinicion];
    this.formularioCaracteristicas.reset({
      clave: '',
      tipo: 'string',
      requerido: false
    });
  }

  eliminarDefinicion(indice: number): void {
    this.definiciones = this.definiciones.filter((_, index) => index !== indice);
  }

  confirmarDefiniciones(): void {
    if (!this.dominioActivo) {
      return;
    }

    this.definicionesService.setDefiniciones(this.dominioActivo, this.definiciones);
    this.definicionSubmit.emit({
      dominio: this.dominioActivo,
      definiciones: this.definiciones.slice()
    });
  }

  private stopDominioSub(): void {
    if (this.dominioSub) {
      this.dominioSub.unsubscribe();
      this.dominioSub = undefined;
    }
  }
}
