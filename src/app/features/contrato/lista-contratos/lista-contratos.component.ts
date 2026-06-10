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
import {Router} from '@angular/router';
import {ContratoBbddService} from '../contrato-bbdd.service';


@Component({
  selector: 'app-lista-contratos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './lista-contratos.component.html',
  styleUrl: './lista-contratos.component.scss',
})
export class ListaContratosComponent implements OnInit {
  evento = output<void>();
  contratoSeleccionado = signal<IContrato | null>(null);
  calendarioIcono = "calendar_today"
  $contratosOriginales = computed(() => this._contratosService.$lista());
  $filtroBusqueda = signal('todos');
  $filtroFecha = signal(false);
  $contratosFiltrados = computed(() => {
    const lista = this.$contratosOriginales();
    const filtro = this.$filtroBusqueda().toLowerCase();
   const fechaFiltroActivo = this.$filtroFecha();
    //filtro por estado:
if(fechaFiltroActivo) {
       const listaFiltrada = [...lista].sort((a,b) => new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime())
      console.log(listaFiltrada)

      if (filtro === 'todos') return listaFiltrada;   
      return listaFiltrada.filter(contrato =>
        contrato.titulo?.toLowerCase().includes(this.$filtroBusqueda().toLowerCase()) ||
        this.getEstadoLabel(contrato.estado).toLowerCase().includes(this.$filtroBusqueda().toLowerCase())
      );
    }else{
      if (filtro === 'todos') return lista;
      return lista.filter(contrato =>
        contrato.titulo?.toLowerCase().includes(filtro) ||
        this.getEstadoLabel(contrato.estado).toLowerCase().includes(filtro)
      );
    }
    
  });
  contadorFalopa: number = 0;
  constructor( private _contratosService:ContratoBbddService, private router:Router ){}
  
  ngOnInit() {
    this._contratosService.cargarLista();
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
    // 🚀 Redirige directamente
    this.contadorFalopa++;
    if (this.contadorFalopa >= 2) {
      this.router.navigate(['/contratos/vista']);
      this.contadorFalopa = 0; // Reinicia el contador después de la redirección
    }
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
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  
  cambiarEstadoSignalFecha(){
    this.$filtroFecha.update(estado => !estado);

  }
}
