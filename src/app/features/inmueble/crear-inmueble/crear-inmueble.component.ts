import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, take } from 'rxjs';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { CaracteristicaEntidad } from '../../caracteristicas/entity-base.interface';
import { IPropietario } from '../../propietario/propietario.interface';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { randomId } from '../../../shared/utilitys';

@Component({
  selector: 'app-crear-inmueble',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormDinamicoComponent,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './crear-inmueble.component.html',
  styleUrl: './crear-inmueble.component.scss',
})
export class CrearInmuebleComponent implements OnInit {
  propietarios: IPropietario[] = [];
  propietarioControl = new FormControl<IPropietario | string>('');
  propietariosFiltrados: IPropietario[] = [];
  propietarioSeleccionado: IPropietario | null = null;
  direccion: string = '';

  constructor(
    private inmueblesService: InmueblesRxjsService,
    private propietariosService: PropietarioRxjsService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.propietarioControl.valueChanges
      .pipe(
        startWith(''),
        map((value) =>
          typeof value === 'string' ? value : this.getNombrePropietario(value),
        ),
        map((nombre) => this.filtrarPropietarios(nombre)),
      )
      .subscribe((propietarios) => {
        this.propietariosFiltrados = propietarios;
      });
    this.propietarioControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.propietarioSeleccionado = null;
      }
    });
    this.cargarPropietarios();
  }

  cargarPropietarios(): void {
    this.propietariosService.cargar().subscribe({
      next: (propietarios) => {
        this.propietarios = propietarios;
      },
      error: () => {
        this.snackbar.mensajeSnackBar('Error al cargar propietarios', 'Cerrar');
      },
    });
  }

  private filtrarPropietarios(nombre: string): IPropietario[] {
    const filtro = nombre.toLowerCase();
    return this.propietarios.filter((propietario) =>
      this.getNombrePropietario(propietario).toLowerCase().includes(filtro),
    );
  }

  displayPropietario = (propietario: IPropietario | string | null): string => {
    return typeof propietario === 'string'
      ? propietario
      : propietario
        ? this.getNombrePropietario(propietario)
        : '';
  };

  onPropietarioSeleccionado(event: MatAutocompleteSelectedEvent): void {
    const propietario = event.option.value;
    this.propietarioSeleccionado = propietario;
    this.propietarioControl.setValue(propietario, { emitEvent: false });
  }

  getNombrePropietario(propietario: IPropietario | null): string {
    return (
      (propietario?.caracteristicas.find((c) => c.clave === 'nombre')
        ?.valor as string) || 'Sin nombre'
    );
  }

  onEntidadCreada(entidad: { caracteristicas: CaracteristicaEntidad[] }): void {
    if (!this.propietarioSeleccionado) {
      this.snackbar.mensajeSnackBar(
        'Por favor selecciona un propietario',
        'Cerrar',
      );
      return;
    }

    const nuevoInmueble = {
      id: randomId(),
      idPropietario: this.propietarioSeleccionado.id,
      caracteristicas: [...entidad.caracteristicas],
      direccion: this.direccion,
      activo: false,
    };
    this.propietarioSeleccionado.listaInmuebles.push(nuevoInmueble.id);
    this.propietariosService
      .actualizarSinRecargar(
        this.propietarioSeleccionado.id,
        this.propietarioSeleccionado,
      )
      .pipe(take(1))
      .subscribe();
    this.inmueblesService.crear(nuevoInmueble).subscribe({
      next: () => {
        this.snackbar.mensajeSnackBar('Inmueble creado exitosamente', 'Cerrar');
        this.propietarioSeleccionado = null;
        this.direccion = '';
        this.propietarioControl.reset('');
      },
      error: (error) => {
        this.snackbar.mensajeSnackBar('Error al crear inmueble', 'Cerrar');
        console.error('Error al crear inmueble', error);
      },
    });
  }
}
