import { computed, inject, Injectable, signal } from '@angular/core';
import { toContratosVista } from './contrato.mapper';
import { ContratoBbddService } from './contrato-bbdd.service';
import { PropietarioRxjsService } from '../propietario/propietario-rxjs.service';
import { ContractStatus, IContratoVista } from './contrato.interface';

@Injectable({
  providedIn: 'root',
})
export class ListaDeContratosService {
  private _contratosService = inject(ContratoBbddService);
  private _propietariosService = inject(PropietarioRxjsService);
  $contratosOriginales = computed(() => {
    return toContratosVista(
      this._contratosService.$lista(),
      this._propietariosService.$lista(),
    );
  });
  $filtroBusqueda = signal('todos');
  $filtroFecha = signal(false);
  $filtroPorVencer = signal(false);
  $filtroNombrePropietario = signal(false);
  $busquedaTexto = signal('');
  $contratosFiltrados = computed(() => {
    let lista = [...this.$contratosOriginales()];
    lista = this.aplicarFiltroOrdenPorFecha(lista);
    lista = this.aplicarFiltroEstado(lista);
    lista = this.aplicarFiltroBusquedaTexto(lista);
    lista = this.aplicarFiltroPorVencer(lista);
    lista = this.aplicarFiltrosNombrePropietario(lista);
    return lista;
  });
  //cambiar el valor a los filtros
  cambiarEstadoSignalFecha() {
    this.$filtroFecha.update((estado) => !estado);
  }
  cambiarEstadoSignalNombrePropietario() {
    this.$filtroNombrePropietario.update((estado) => !estado);
  }
  cambiarEstadoSignalPorVencer() {
    this.$filtroPorVencer.update((estado) => !estado);
  }

  //aplicar filtros a lista de contratos
  aplicarFiltroOrdenPorFecha(lista: IContratoVista[]) {
    const fechaFiltroActivo = this.$filtroFecha();
    if (fechaFiltroActivo) {
      return [...lista].sort(
        (a, b) =>
          new Date(a.proximoAumento).getTime() -
          new Date(b.proximoAumento).getTime(),
      );
    }
    return lista;
  }

  aplicarFiltroEstado(lista: IContratoVista[]) {
    const filtroBusqueda = this.$filtroBusqueda();
    if (filtroBusqueda === 'todos') return lista;
    return lista.filter(
      (contrato) =>
        contrato.titulo
          ?.toLowerCase()
          .includes(this.$filtroBusqueda().toLowerCase()) ||
        this.getEstadoLabel(contrato.estado)
          .toLowerCase()
          .includes(this.$filtroBusqueda().toLowerCase()),
    );
  }
  aplicarFiltrosNombrePropietario(lista: IContratoVista[]) {
    const filtroNombrePropietario = this.$filtroNombrePropietario();
    if (filtroNombrePropietario) {
      lista.sort((a, b) => {
        const nombreA = a.propietarioNombre;
        const nombreB = b.propietarioNombre;
        return nombreA.localeCompare(nombreB);
      });
      return lista;
    }
    return lista;
  }
  aplicarFiltroBusquedaTexto(lista: IContratoVista[]): IContratoVista[] {
    const texto = this.$busquedaTexto().trim().toLowerCase();
    if (!texto) return lista;
    return lista.filter(
      (p) =>
        p.propietarioNombre.toLowerCase().includes(texto) ||
        p.titulo?.toLowerCase().includes(texto),
    );
  }
  aplicarFiltroPorVencer(lista: IContratoVista[]): IContratoVista[] {
    if (!this.$filtroPorVencer()) return lista;
    const listaAux = lista.filter((contrato) => {
      return contrato.porFinalizar === true;
    });
    return this.ordenarPorDiasParaVencimiento(listaAux);
  }
  ordenarPorDiasParaVencimiento(lista: IContratoVista[]): IContratoVista[] {
    return [...lista].sort((a, b) => a.diasFinalizacion - b.diasFinalizacion);
  }
  //Labels
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
  //vencimientos
  evaluarVencimientosContratos() {
    this._contratosService.evaluarVencimientoDeTodosLosContratos(
      this.$contratosOriginales(),
    );
  }
}
