import { Component, computed, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { toContratosVista } from '../contrato.mapper';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';

@Component({
  selector: 'app-lista-contratos',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
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
  $busquedaTexto = signal('');
  $contratosFiltrados = computed(() => {
    let lista = [...this.$contratosOriginales()];
    lista = this.aplicarFiltroOrdenPorFecha(lista);
    lista = this.aplicarFiltroEstado(lista)
    lista = this.aplicarFiltroBusquedaTexto(lista)
    lista = this.aplicarFiltrosNombrePropietario(lista)
    return lista
  });
  contadorFalopa: number = 0;
  constructor( private _contratosService:ContratoBbddService, private router:Router, private _propietariosService: PropietarioRxjsService){}

  ngOnInit() {
    this._contratosService.cargarLista();
  }

  navegarPrimerResultado() {
    const primerResultado = this.$contratosFiltrados()[0];
    if (primerResultado) {
      this.contratoSeleccionado.set(primerResultado as IContrato);
      this._contratosService.seleccionarContrato(primerResultado as IContrato);
      this.router.navigate(['/contratos/vista']);
    }
  }

  private aplicarFiltroBusquedaTexto(lista: IContratoVista[]): IContratoVista[] {
    const texto = this.$busquedaTexto().trim().toLowerCase();
    if (!texto) return lista;
    return lista.filter(p =>
      p.propietarioNombre.toLowerCase().includes(texto) ||
      p.titulo?.toLowerCase().includes(texto)
    );
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

