import { Component, OnInit } from '@angular/core';
import { IContrato } from '../contrato.interface';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { ModalService } from '../../../core/modal/modal.service';
import { EditarContratoComponent } from '../modals/editar-contrato/editar-contrato.component';
import { EliminarContratoComponent } from '../modals/eliminar-contrato/eliminar-contrato.component';
import { SolicitarIndiceContratoComponent } from '../modals/solicitar-indice-contrato/solicitar-indice-contrato.component';
import { InformacionAdicionalComponent } from '../modals/informacion-adicional/informacion-adicional.component';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import { A11yModule } from '@angular/cdk/a11y';
import { AsyncPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { InmueblesRxjsService } from '../../inmueble/inmuebles-rxjs.service';
import { AgregarGastosContratoComponent } from '../modals/agregar-gastos-contrato/agregar-gastos-contrato.component';

@Component({
  selector: 'app-contrato-c',
  imports: [
    A11yModule,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './contrato-c.component.html',
  styleUrl: './contrato-c.component.scss',
})
export class ContratoCComponent implements OnInit {
  constructor(
    public _contratosService: ContratoBbddService,
    private _modalService: ModalService,
    private _liquidacion: LiquidacionGeneratorService,
    private router: Router,
    private _inmuebleService: InmueblesRxjsService,
  ) {}
  ngOnInit() {
    this._contratosService.cargarLista();
    this._liquidacion.cargarLista();
  }

  // botones de accion para el contrato
  agregarInformacionAdicional(contrato: IContrato) {
    this._modalService.abrirModal<IContrato>(
      'Agregar detalles al contrato',
      InformacionAdicionalComponent,
      contrato,
    );
  }

  editarContrato(contrato: IContrato) {
    this._modalService.abrirModal<IContrato>(
      'Editar Contrato',
      EditarContratoComponent,
      contrato,
    );
  }
  eliminarContrato(contrato: IContrato) {
    this._modalService.abrirModal<IContrato>(
      'Eliminar Contrato',
      EliminarContratoComponent,
      contrato,
    );
  }
  agregarGastosContrato(contrato: IContrato) {
    const liquidacionAux = this._liquidacion.buscarLiquidacionPorContrato(
      contrato.id,
    );
    if (liquidacionAux) {
      liquidacionAux.montoAlquiler = contrato.rentaMensual;
      this._liquidacion.setSignalSeleccionado(liquidacionAux);
      this._liquidacion.actualizarLiquidacionSeleccionada();
      this._modalService.abrirModal(
        'Gastos y Liquidaciones',
        AgregarGastosContratoComponent,
        liquidacionAux,
      );
      // this.router.navigate(['/contratos/liquidaciones']);
    } else {
      console.warn('La liquidacionAux dio undefinded:', liquidacionAux);
    }
  }
  solicitarIndice(contrato: IContrato) {
    this._modalService.abrirModal<IContrato>(
      'Solicitar indice',
      SolicitarIndiceContratoComponent,
      contrato,
    );
  }
  actualizarProximoAumento(contrato: IContrato) {
    const confirmarActualizacion = window.confirm(
      '¿Estas seguro de que queres modificar la proxima fecha de aumento?',
    );

    if (!confirmarActualizacion) return;

    const contratoActualizado = {
      ...contrato,
      proximoAumento: this._contratosService.declararProximoMesDeAumento(
        contrato.periodoAumento,
        contrato.proximoAumento,
      ),
    };
    this._contratosService
      .actualizar(contrato.id, contratoActualizado)
      .subscribe({
        next: () => {
          console.log('proximo aumento actualizado');
        },
      });
  }
  //cambiar valor $sideBarInfo ( desde el servicio de contratos)
  cambiarValorSidebarInfo(id: number) {
    this._contratosService.$sideBarInfo.set(true);
    this._contratosService.$contratoIdSideBarInfo.set(id);
  }

  volverALaListaDeContratos() {
    this.router.navigate([
      '/contratos',
      { outlets: { primary: 'lista', detalle: null } },
    ]);
  }
  devolverDireccionInmueble(id: number): string {
    return this._inmuebleService.obtenerDireccion(id);
  }
}
