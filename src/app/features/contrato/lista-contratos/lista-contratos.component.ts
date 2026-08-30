import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  IContrato,
  ContractStatus,
  EstadoRenovacion,
  IContratoVista,
} from '../contrato.interface';
import { Router } from '@angular/router';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { toContratosVista } from '../contrato.mapper';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { ListaDeContratosService } from '../lista-de-contratos.service';

@Component({
  selector: 'app-lista-contratos',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './lista-contratos.component.html',
  styleUrl: './lista-contratos.component.scss',
})
export class ListaContratosComponent implements OnInit {
  private _listaContratosService = inject(ListaDeContratosService);
  private _contratosService = inject(ContratoBbddService);
  private router = inject(Router);
  evento = output<void>();
  contratoSeleccionado = signal<IContrato | null>(null);
  calendarioIcono = 'calendar_today';
  contadorFalopa: number = 0;
  contratosFiltrados = this._listaContratosService.$contratosFiltrados;
  $busquedaTexto = this._listaContratosService.$busquedaTexto;
  $filtroFecha = this._listaContratosService.$filtroFecha;
  $filtroNombrePropietario =
    this._listaContratosService.$filtroNombrePropietario;
  $filtroBusqueda = this._listaContratosService.$filtroBusqueda;

  $contratosFiltrados = this._listaContratosService.$contratosFiltrados;
  ngOnInit() {
    this._contratosService.cargarLista();
  }

  navegarPrimerResultado() {
    const primerResultado = this.contratosFiltrados()[0];
    if (primerResultado) {
      this.contratoSeleccionado.set(primerResultado as IContrato);
      this._contratosService.seleccionarContrato(primerResultado as IContrato);
      this.router.navigate(['/contratos/vista']);
    }
  }

  eventoSidenav() {
    this.evento.emit();
  }
  seleccionarContrato(contrato: IContrato) {
    this.contratoSeleccionado.set(contrato);
    this._contratosService.seleccionarContrato(contrato);
  }
  evaluarClick(contrato: IContrato): void {
    if (this.contratoSeleccionado() === contrato) {
      this.router.navigate(['/contratos/vista']);
    } else {
      // 📌 Si no estaba seleccionado, el primer click solo lo selecciona
      this.seleccionarContrato(contrato);
    }
  }
  getEstadoColor(estado: ContractStatus): string {
    const colores: Record<ContractStatus, string> = {
      preliminar: 'preliminar',
      activo: 'activo',
      finalizado: 'finalizado',
      cancelado: 'cancelado',
      renovar: 'renovar',
    };
    return colores[estado];
  }
  getEstadoLabel(estado: ContractStatus): string {
    const labels: Record<ContractStatus, string> = {
      preliminar: 'Preliminar',
      activo: 'Activo',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
      renovar: 'Renovar',
    };
    return labels[estado];
  }
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  }
  formatearFecha(fecha: Date): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  irACrearContrato() {
    this.router.navigate(['/contratos/crear']);
  }
  convertirChipEstadoRenovacion(estadoRenovacion: EstadoRenovacion): string {
    if (estadoRenovacion === 'normal') return '';
    if (estadoRenovacion === 'un_mes') return '1 mes';
    if (estadoRenovacion === 'dos_meses') return '2 meses';
    if (estadoRenovacion === 'hoy') return 'hoy';
    if (estadoRenovacion === 'vencido') return 'vencido';
    return '';
  }
  //aplicar filtros enviandoselos al servicio
  evaluarVencimientosContratos() {
    this._listaContratosService.evaluarVencimientosContratos();
  }
  cambiarEstadoSignalFecha() {
    this._listaContratosService.cambiarEstadoSignalFecha();
  }
  cambiarEstadoSignalNombrePropietario() {
    this._listaContratosService.cambiarEstadoSignalNombrePropietario();
  }
}
