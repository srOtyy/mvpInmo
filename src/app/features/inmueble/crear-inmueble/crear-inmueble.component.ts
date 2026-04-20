import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormDinamicoComponent } from '../../../shared/form-dinamico/form-dinamico.component';
import { InmueblesRxjsService } from '../inmuebles-rxjs.service';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { CaracteristicaEntidad } from '../../caracteristicas/entity-base.interface';
import { SnackbarService } from '../../../core/snackbar.service';
import { IPropietario } from '../../propietario/propietario.interface';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
@Component({
  selector: 'app-crear-inmueble',
  standalone: true,
  imports: [CommonModule, FormsModule, FormDinamicoComponent, MatSelectModule, MatFormFieldModule, MatOptionModule],
  templateUrl: './crear-inmueble.component.html',
  styleUrl: './crear-inmueble.component.scss'
})
export class CrearInmuebleComponent implements OnInit {

  propietarios: IPropietario[] = [];
  propietarioSeleccionado: IPropietario | null = null;

  constructor(
    private inmueblesService: InmueblesRxjsService,
    private propietariosService: PropietarioRxjsService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.cargarPropietarios();
  }

  cargarPropietarios(): void {
    this.propietariosService.cargar().subscribe({
      next: (propietarios) => {
        this.propietarios = propietarios;
      },
      error: () => {
        this.snackbar.mensajeSnackBar('Error al cargar propietarios', 'Cerrar');
      }
    });
  }

  getNombrePropietario(propietario: IPropietario): string {
    return propietario.caracteristicas
      .find(c => c.clave === 'nombre')?.valor as string || 'Sin nombre';
  }

  onEntidadCreada(entidad: { caracteristicas: CaracteristicaEntidad[] }): void {
    if (!this.propietarioSeleccionado) {
      this.snackbar.mensajeSnackBar('Por favor selecciona un propietario', 'Cerrar');
      return;
    }

  
    const nuevoInmueble = {
      id: this.randomId(),
      idPropietario: this.propietarioSeleccionado.id,
      caracteristicas: [...entidad.caracteristicas]
    };

    this.inmueblesService.crear(nuevoInmueble).subscribe({
      next: () => {
        this.snackbar.mensajeSnackBar('Inmueble creado exitosamente', 'Cerrar');
        this.propietarioSeleccionado = null;
      },
      error: (error) => {
        this.snackbar.mensajeSnackBar('Error al crear inmueble', 'Cerrar');
        console.error('Error al crear inmueble', error);
      }
    })
  }
  private randomId(): number {
    return Math.floor(Math.random() * 1_000_000) + 1;
  }
}
