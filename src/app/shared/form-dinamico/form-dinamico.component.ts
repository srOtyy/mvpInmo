import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Dominio } from '../../core/navegacion/navegacionRutas';
import { DefinicionCaracteristica } from '../definicion-caracteristica.interface';
import { DefinicionesCaracteristicasService } from '../definiciones-caracteristicas.service';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
@Component({
  selector: 'app-form-dinamico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './form-dinamico.component.html',
  styleUrl: './form-dinamico.component.scss'
})
export class FormDinamicoComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dominio!: Dominio;
  // será que la interfas de las caracteristicas le hace falta el 'requerido'?
  @Output() entidadCreada = new EventEmitter<{ caracteristicas: { clave: string; valor: any }[] }>();

  definiciones: DefinicionCaracteristica[] = [];
  formulario: FormGroup = new FormGroup({});

  private destroy$ = new Subject<void>();

  constructor(private definicionesService: DefinicionesCaracteristicasService) {}

  ngOnInit(): void {
    this.definicionesService
      .getDefiniciones$(this.dominio)
      .pipe(takeUntil(this.destroy$))
      .subscribe(definiciones => {
        this.definiciones = definiciones.slice();
        this.construirFormulario(this.definiciones);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  crearEntidad(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.value;
    const entidad = {
      caracteristicas: this.definiciones.map(definicion => ({
        clave: definicion.clave,
        valor: valores[definicion.clave]
      }))
    };

    this.entidadCreada.emit(entidad);
    this.construirFormulario(this.definiciones);
  }

  private construirFormulario(definiciones: DefinicionCaracteristica[]): void {
    const controles: Record<string, FormControl> = {};

    for (const definicion of definiciones) {
     
      const valorInicial = definicion.tipo === 'booleano' ? false : null;

      if (!definicion.requerido) {
        controles[definicion.clave] = new FormControl(valorInicial);
        continue;
      }

      const validator = definicion.tipo === 'booleano' ? Validators.requiredTrue : Validators.required;
      controles[definicion.clave] = new FormControl(valorInicial, validator);
    }

    this.formulario = new FormGroup(controles);
  }
}
