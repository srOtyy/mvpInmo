import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { Dominio } from '../../core/navegacion/navegacionRutas';
import { RutasDinamicasService } from '../../core/navegacion/rutas-dinamicas.service';
import { DefinicionCaracteristica } from '../definicion-caracteristica.interface';
import { DefinicionesCaracteristicasService } from '../definiciones-caracteristicas.service';

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
  private destroy$ = new Subject<void>();

  dominioActivo: Dominio | null = null;

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
    this.rutasDinamicasService.dominioActivo$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(dominio => {
          this.dominioActivo = dominio;

          if (!dominio) {
            this.definiciones = [];
            return of<DefinicionCaracteristica[]>([]);
          }

          return this.definicionesService.getDefiniciones$(dominio);
        })
      )
      .subscribe(definiciones => {
        this.definiciones = definiciones.slice();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      tipo: 'texto',
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
}
