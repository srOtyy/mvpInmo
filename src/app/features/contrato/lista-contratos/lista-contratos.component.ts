import { Component, inject, OnInit, output, signal } from '@angular/core';
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
  tipoDeContrato,
} from '../contrato.interface';
import { Router } from '@angular/router';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { ListaDeContratosService } from '../lista-de-contratos.service';
import { estadosRenovacionYEstadosGenerales } from '../contrato.mapper';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import { SnackbarService } from '../../../core/snackbar.service';
import {
  EstadoServicioLiquidacion,
  SeguimientoEGLAI,
} from '../eglai.interface';
interface ChipEGLAI {
  servicio: string;
  estado: EstadoServicioLiquidacion;
}
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
  private _liquidacionesService = inject(LiquidacionGeneratorService);
  private _snackbar = inject(SnackbarService);
  private router = inject(Router);
  evento = output<void>();
  modoVista = signal<'normal' | 'liquidaciones'>('normal');
  restableciendoEGLAI = signal(false);
  admTotalIcono = 'person_off';
  //estados para el filtro de estado de contrato
  estadosRenovacionYEstadosGenerales = estadosRenovacionYEstadosGenerales;
  //filtros y signals
  contratoSeleccionado = signal<IContrato | null>(null);
  contadorFalopa: number = 0;
  contratosFiltrados = this._listaContratosService.$contratosFiltrados;
  $busquedaTexto = this._listaContratosService.$busquedaTexto;
  $filtroFecha = this._listaContratosService.$filtroFecha;
  $filtroPorVencer = this._listaContratosService.$filtroPorVencer;
  $filtroTituloContrato = this._listaContratosService.$filtroTituloContrato;
  $filtroBusqueda = this._listaContratosService.$filtroBusqueda;
  $contratosFiltrados = this._listaContratosService.$contratosFiltrados;
  $filtroAdmTotal = this._listaContratosService.$filtroAdmTotal;
  ngOnInit() {
    this._contratosService.cargarLista();
  }

  navegarPrimerResultado() {
    const primerResultado = this.contratosFiltrados()[0];
    if (primerResultado) {
      this.seleccionarContrato(primerResultado as IContrato);
      this.router.navigate([
        '/contratos',
        { outlets: { primary: 'lista', detalle: 'vista' } },
      ]);
    }
  }
  cambiarIconoAdmTotal() {
    if (this.$filtroAdmTotal() == true) {
      this.admTotalIcono = 'person';
    } else {
      this.admTotalIcono = 'person_off';
    }
  }
  eventoSidenav() {
    this.evento.emit();
  }
  seleccionarContrato(contrato: IContrato) {
    this.contratoSeleccionado.set(contrato);
    this._contratosService.seleccionarContrato(contrato);
    this._contratosService.$contratoIdSideBarInfo.set(contrato.id);
    this._contratosService.$sideBarInfo.set(true);
  }
  evaluarClick(contrato: IContrato): void {
    this.seleccionarContrato(contrato);
    this.router.navigate([
      '/contratos',
      { outlets: { primary: 'lista', detalle: 'vista' } },
    ]);
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

  convertirChipEstadoRenovacion(estadoRenovacion: EstadoRenovacion): string {
    if (estadoRenovacion === 'normal') return '';
    if (estadoRenovacion === 'un_mes') return '1 mes';
    if (estadoRenovacion === 'dos_meses') return '2 meses';
    if (estadoRenovacion === 'hoy') return 'hoy';
    if (estadoRenovacion === 'vencido') return 'Este mes';
    if (estadoRenovacion === 'porFinalizar') return 'por finalizar';
    return '';
  }
  convertirChipEstadoContrato(estado: ContractStatus): string {
    if (estado === 'activo') return 'Activo';
    if (estado === 'cancelado') return 'Cancelado';
    if (estado === 'finalizado') return 'Finalizado';
    if (estado === 'preliminar') return 'Preliminar';
    if (estado === 'renovar') return 'Por renovar';
    return '';
  }
  convertirChipTipoDeContrato(tipo: tipoDeContrato): string {
    if (tipo === 'comercial') return 'Comercial';
    if (tipo === 'temporadaInvierno') return 'Temporada invierno';
    if (tipo === 'verano') return 'Temporada Verano';
    if (tipo === 'viviendaPermanente') return 'Vivienda permantente';
    if (tipo === 'comodato') return 'Comodato';
    return '';
  }
  //Filtros de la lista de contratos
  evaluarVencimientosContratos() {
    this._listaContratosService.evaluarVencimientosContratos();
  }
  cambiarEstadoSignalFecha() {
    this._listaContratosService.cambiarEstadoSignalFecha();
  }
  cambiarEstadoSignalNombrePropietario() {
    this._listaContratosService.cambiarEstadoSignalNombrePropietario();
  }
  cambiarEstadoSignalPorVencer() {
    this._listaContratosService.cambiarEstadoSignalPorVencer();
  }
  cambiarEstadoSignalAdmTotal() {
    this._listaContratosService.cambiarEstadoSignalAdmTotal();
    this.cambiarIconoAdmTotal();
  }
  //total honorarios
  mostrarTotalHonorarios() {
    const totalHonorarios =
      this._listaContratosService.calcularTotalHonorarios();
    console.log('Total honorarios: $', Math.round(totalHonorarios));
  }

  //EGLAI

  restablecerServiciosEGLAI() {
    if (this.restableciendoEGLAI()) return;
    const confirmar = window.confirm(
      '¿Restablecer todos los servicios EGLAI cargados a pendientes para iniciar el próximo ciclo de liquidaciones?',
    );
    if (!confirmar) return;

    this.restableciendoEGLAI.set(true);
    this._liquidacionesService.restablecerServiciosEGLAI().subscribe({
      next: (cantidad) => {
        this._snackbar.mensajeSnackBar(
          cantidad > 0
            ? `Se restablecieron ${cantidad} servicios EGLAI`
            : 'No había servicios EGLAI cargados para restablecer',
          'Cerrar',
        );
        this.restableciendoEGLAI.set(false);
      },
      error: (error) => {
        console.error('No se pudieron restablecer los servicios EGLAI', error);
        this._snackbar.mensajeSnackBar(
          'No se pudieron restablecer los servicios EGLAI',
          'Cerrar',
        );
        this.restableciendoEGLAI.set(false);
      },
    });
  }
  cambiarModoVista() {
    if (this.modoVista() === 'normal') {
      this.modoVista.set('liquidaciones');
    } else {
      this.modoVista.set('normal');
    }
  }
  private formatearServicioEGLAI(servicio: keyof SeguimientoEGLAI): string {
    const nombres: Record<keyof SeguimientoEGLAI, string> = {
      expensas: 'Expensas',
      gas: 'Gas',
      luz: 'Luz',
      agua: 'Agua',
      internet: 'Internet',
      seguro: 'Seguro',
    };

    return nombres[servicio];
  }
  // Función para obtener los chips de EGLAI a partir del objeto SeguimientoEGLAI, la funcion de abajo es mas explicita. Pero hacen lo mismo y no se usa. Podria eliminarse cuando se desee pero sirve para comrpender la primera
  obtenerChipsEGLAI(eglai: SeguimientoEGLAI | undefined): ChipEGLAI[] {
    if (!eglai) return [];

    return (
      Object.entries(eglai) as [
        keyof SeguimientoEGLAI,
        EstadoServicioLiquidacion,
      ][]
    )
      .filter(([_, estado]) => estado !== 'no-requerido')
      .map(([servicio, estado]) => ({
        servicio: this.formatearServicioEGLAI(servicio),
        estado,
      }));
  }
  obtenerChipsEGLAIExplicito(eglai: SeguimientoEGLAI | undefined): ChipEGLAI[] {
    if (!eglai) return [];

    const chips: ChipEGLAI[] = [];

    for (const [servicio, estado] of Object.entries(eglai) as [
      keyof SeguimientoEGLAI,
      EstadoServicioLiquidacion,
    ][]) {
      if (estado === 'no-requerido') continue;

      chips.push({
        servicio: this.formatearServicioEGLAI(servicio),
        estado,
      });
    }

    return chips;
  }
}
