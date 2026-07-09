import { Component, computed, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IContrato, ContractStatus, EstadoRenovacion, IContratoVista } from '../contrato.interface';
import {Router} from '@angular/router';
import {ContratoBbddService} from '../contrato-bbdd.service';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import { toContratosVista } from '../contrato.mapper';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';

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
  $contratosOriginales = computed(() => {
    //no me dejaba mandar como argumento $listPropietarios(), solo sin los parentesis
    return toContratosVista( this._contratosService.$lista(),this._propietariosService.$lista())
   });
  $filtroBusqueda = signal('todos');
  $filtroFecha = signal(false);
  $filtroNombrePropietario = signal(false);
  $contratosFiltrados = computed(() => {
    let lista = [...this.$contratosOriginales()];
    lista = this.aplicarFiltroOrdenPorFecha(lista);
    lista = this.aplicarFiltroEstado(lista)
    lista = this.aplicarFiltrosNombrePropietario(lista)
    return lista
  });
  contadorFalopa: number = 0;
  constructor( private _contratosService:ContratoBbddService, private router:Router, private _propietariosService: PropietarioRxjsService){}
  
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
  cambiarEstadoSignalNombrePropietario(){
    this.$filtroNombrePropietario.update(estado => !estado);
  }
  irACrearContrato(){
    this.router.navigate(['/contratos/crear']);
  }
  convertirChipEstadoRenovacion(estadoRenovacion: EstadoRenovacion): string{
    if(estadoRenovacion === 'normal') return '';
    if(estadoRenovacion === 'un_mes') return '1 mes';
    if(estadoRenovacion === 'dos_meses') return '2 meses';
    if(estadoRenovacion === 'hoy') return 'hoy';
    if(estadoRenovacion === 'vencido') return 'vencido';
    return ''
  }

  //filtros del signal lista de contratos
  private aplicarFiltroOrdenPorFecha(lista: IContratoVista[]) {
    const fechaFiltroActivo = this.$filtroFecha();
    if (fechaFiltroActivo){
      return [...lista].sort((a,b) => new Date(a.proximoAumento).getTime() - new Date(b.proximoAumento).getTime())
    }
    return lista
  }
  private aplicarFiltroEstado(lista: IContratoVista[]){
    const filtroBusqueda = this.$filtroBusqueda();
    if (filtroBusqueda === 'todos') return lista;   
    return lista.filter(contrato =>
      contrato.titulo?.toLowerCase().includes(this.$filtroBusqueda().toLowerCase()) || this.getEstadoLabel(contrato.estado).toLowerCase().includes(this.$filtroBusqueda().toLowerCase())
    );
  }
  private aplicarFiltrosNombrePropietario(lista: IContratoVista[]){
    const filtroNombrePropietario = this.$filtroNombrePropietario()
     if (filtroNombrePropietario) {
        lista.sort((a, b) => {
          const nombreA = a.propietarioNombre;
          const nombreB = b.propietarioNombre;
          return nombreA.localeCompare(nombreB);
        });
        return lista
      }
      return lista
  }
}

