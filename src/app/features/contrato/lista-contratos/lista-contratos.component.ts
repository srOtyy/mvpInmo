import { Component, computed, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IContrato, ContractStatus } from '../contrato.interface';
import {ContratoBbddService} from '../contrato-bbdd.service';
@Component({
  selector: 'app-lista-contratos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './lista-contratos.component.html',
  styleUrl: './lista-contratos.component.scss'
})
export class ListaContratosComponent implements OnInit {
  evento = output<void>();
  contratoSeleccionado = signal<IContrato | null>(null);

  $contratosOriginales = computed(() => this._contratosService.$lista());
  $filtroBusqueda = signal('todos');
  $contratosFiltrados = computed(() => {
    const lista = this.$contratosOriginales();
    const filtro = this.$filtroBusqueda().toLowerCase();

    if (filtro === 'todos') return lista;

    return lista.filter(contrato =>
      contrato.titulo?.toLowerCase().includes(this.$filtroBusqueda().toLowerCase()) ||
      this.getEstadoLabel(contrato.estado).toLowerCase().includes(this.$filtroBusqueda().toLowerCase())
    );
  });
  constructor( private _contratosService:ContratoBbddService ){}
  
  ngOnInit() {
    this._contratosService.cargarLista();
  }
  eventoSidenav() {
      this.evento.emit();
  }
  seleccionarContrato(contrato: IContrato) {
    this.contratoSeleccionado.set(contrato);
  }

  getEstadoColor(estado: ContractStatus): string {
    const colores: Record<ContractStatus, string> = {
      preliminar: 'preliminar',
      activo: 'activo',
      finalizado: 'finalizado',
      cancelado: 'cancelado',
      renovar: 'renovar'
    };
    return colores[estado];
  }
  getEstadoLabel(estado: ContractStatus): string {
    const labels: Record<ContractStatus, string> = {
      preliminar: 'Preliminar',
      activo: 'Activo',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
      renovar: 'Renovar'
    };
    return labels[estado];
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }
  formatearFecha(fecha: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(fecha);
  }

  //filtrar listado de contratos
  // filtrarContratos() {
  //   this.$contratos.update(contratos => {
  //     if (this.$filtroBusqueda() === 'todos'){
  //       return this._contratosService.$lista();
  //     }else{
  //       return this._contratosService.$lista().filter(contrato =>
  //         contrato.titulo?.toLowerCase().includes(this.$filtroBusqueda().toLowerCase()) ||
  //         this.getEstadoLabel(contrato.estado).toLowerCase().includes(this.$filtroBusqueda().toLowerCase())
  //       );
  //     };
     
  //   });
  // }

}
