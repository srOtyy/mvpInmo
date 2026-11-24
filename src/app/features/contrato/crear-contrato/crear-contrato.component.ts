import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { IContrato, TipoPago, tipoDeContrato } from '../contrato.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import {
  IPropietario,
  IPropietarioVista,
} from '../../propietario/propietario.interface';
import {
  IInquilino,
  IInquilinoVista,
} from '../../inquilino/inquilino.interface';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { randomId } from '../../../shared/utilitys';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CicloDeVidaContratosService } from '../ciclo-de-vida-contratos.service';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { forkJoin, map, Observable, startWith, switchMap } from 'rxjs';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { InquilinoRxjsService } from '../../inquilino/inquilino-rxjs.service';
import { InmueblesRxjsService } from '../../inmueble/inmuebles-rxjs.service';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-crear-contrato',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatDividerModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss',
})
export class CrearContratoComponent implements OnInit {
  formulario: FormGroup = new FormGroup({});
  tipoPagoOpciones: TipoPago[] = ['efectivo', 'transferencia'];
  tipoDeContratoOpciones: tipoDeContrato[] = [
    'viviendaPermanente',
    'comercial',
    'verano',
    'temporadaInvierno',
    'comodato',
  ];
  propietariosFiltrados!: Observable<IPropietarioVista[]>;
  inquilinosFiltrados!: Observable<IInquilinoVista[]>;
  busquedaInquilino = new FormControl<string | IInquilinoVista>('', {
    nonNullable: true,
  });
  busquedaPropietario = new FormControl<string | IPropietarioVista>('', {
    nonNullable: true,
  });
  $propietarioId = signal<number>(0);
  constructor(
    private contratosService: ContratoBbddService,
    private _snack: SnackbarService,
    private _liquidacion: LiquidacionGeneratorService,
    private _cicloDeVida: CicloDeVidaContratosService,
    private _propietariosService: PropietarioRxjsService,
    private _inquilinoService: InquilinoRxjsService,
    private _inmueblesService: InmueblesRxjsService,
  ) {
    this.formulario = new FormGroup({
      id: new FormControl(randomId(), Validators.required),
      propietarios: new FormControl<number[]>([], {
        nonNullable: true,
        validators: Validators.required,
      }),
      inmuebleId: new FormControl(
        { value: '', disabled: true },
        Validators.required,
      ),
      inquilinos: new FormControl<number[]>([], {
        nonNullable: true,
        validators: Validators.required,
      }),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      rentaMensual: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
      estado: new FormControl('preliminar', Validators.required),
      periodoAumento: new FormControl('', [
        Validators.required,
        Validators.min(0),
      ]),
      proximoAumento: new FormControl(''),
      titulo: new FormControl(''),
      porcentajeHonorarios: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      tipoPago: new FormControl('', Validators.required),
      tipoIndice: new FormControl('IPC'),
      inicioDelPeriodo: new FormControl('1', [
        Validators.max(31),
        Validators.min(1),
      ]),
      diasFinalizacion: new FormControl(-1),
      porFinalizar: new FormControl(false),
      requiereAccion: new FormControl(false),
      tipoDeContrato: new FormControl(
        'viviendaPermanente',
        Validators.required,
      ),
      valorInicialDelContrato: new FormControl(0),
      InformacionAdicionalComponent: new FormControl([]),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.contratosService.obtenerListas().catch((error) => {
      console.error(
        'Error al cargar las listas para el formulario de contratos:',
        error,
      );
      this._snack.mensajeSnackBar(
        'Error al cargar datos para el formulario',
        'Cerrar',
      );
    });
    this.propietariosFiltrados = this.busquedaPropietario.valueChanges.pipe(
      startWith(this.busquedaPropietario.value),
      map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
      map((nombre) => this._filtrarPropietarios(nombre)),
    );
    this.inquilinosFiltrados = this.busquedaInquilino.valueChanges.pipe(
      startWith(this.busquedaInquilino.value),
      map((valor) => (typeof valor === 'string' ? valor : valor.nombre)),
      map((nombre) => this._filtrarInquilinos(nombre)),
    );
  }
  // para el oninit de los observables de autocomplete
  private _filtrarPropietarios(nombre: string): IPropietarioVista[] {
    const filterValue = nombre.toLowerCase().trim();
    const idsSeleccionados = new Set(this.propietariosSeleccionados);
    return this.propietariosLista.filter(
      (propietario) =>
        !idsSeleccionados.has(propietario.id) &&
        propietario.nombre.toLowerCase().includes(filterValue),
    );
  }
  displayPropietario(propietario: IPropietarioVista): string {
    return propietario?.nombre ?? '';
  }
  private _filtrarInquilinos(nombre: string): IInquilinoVista[] {
    const filterValue = nombre.toLowerCase().trim();
    const idsSeleccionados = new Set(this.inquilinosSeleccionados);
    return this.inquilinosDisponiblesLista.filter(
      (inquilino) =>
        !idsSeleccionados.has(inquilino.id) &&
        inquilino.nombre.toLowerCase().includes(filterValue),
    );
  }
  displayInquilino(inquilino: IInquilinoVista | null): string {
    return inquilino?.nombre ?? '';
  }
  displayInmueble(inmueble: (typeof this.inmueblesLista)[number]): string {
    const piso = obtenerCaracteristica(inmueble, 'piso');
    const letra = obtenerCaracteristica(inmueble, 'letra');
    const detalles = [
      piso ? `Piso ${piso}` : '',
      letra ? `letra ${letra}` : '',
    ].filter(Boolean);

    return [inmueble.direccion, detalles.join(', ')]
      .filter(Boolean)
      .join(' - ');
  }

  //getters
  get propietariosLista() {
    return this.convertirArrayPropietarios(
      this.contratosService.$listaPropietarios,
    );
  }
  get inquilinosLista() {
    return this.convertirArrayInquilinos(
      this.contratosService.$listaInquilinos,
    );
  }
  get inquilinosDisponiblesLista() {
    return this.inquilinosLista.filter((inquilino) => !inquilino.activo);
  }
  get inquilinosSeleccionados(): number[] {
    return this.formulario.get('inquilinos')?.value ?? [];
  }
  get propietariosSeleccionados(): number[] {
    return this.formulario.get('propietarios')?.value ?? [];
  }
  get inmueblesLista() {
    return this.contratosService.$listaInmuebles;
  }
  get filteredInmueblesLista() {
    const propietarioId = this.$propietarioId();
    if (!propietarioId) {
      return [];
    }
    const inmueblesArray =
      this._propietariosService.obtenerArrayDeInmueblesPorId(propietarioId);
    return this._inmueblesService.obtenerArrayDeInmueblesInactivosPorId(
      inmueblesArray,
    );
  }
  get rentaMensual() {
    return this.formulario.get('rentaMensual');
  }
  //submit
  enviarContrato() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this._snack.mensajeSnackBar(
        'Completa los campos obligatorios del contrato',
        'Cerrar',
      );
      return;
    }
    const contrato: IContrato = this.formulario.getRawValue();
    contrato.valorInicialDelContrato = contrato.rentaMensual;
    contrato.informacionAdicional = [];
    contrato.administracionTotal = false;
    contrato.proximoAumento = this.contratosService.declararProximoMesDeAumento(
      contrato.periodoAumento,
      contrato.fechaInicio,
    );
    contrato.estadoRenovacion =
      this._cicloDeVida.calcularEstadoDeRenovacion(contrato);
    this.contratosService.crear(contrato).subscribe({
      next: () => {
        /*
        En este lugar se tiene que crear la liquidacion del contrato. ¿Que datos necesito para crear la liquidacion? El contrato, el nombre del propietario, el nombre del inquilino y los items de la liquidacion. 
        */
        const liquidacion = this._liquidacion.crearLiquidacion(
          contrato,
          contrato.propietarios
            .map((id) => this.nombrePropietarioXId(id))
            .filter((nombre) => nombre !== 'Nombre no disponible'),
          contrato.inquilinos
            .map((id) => this.nombreInquilinoXId(id))
            .filter((nombre) => nombre !== 'Nombre no disponible'),
        );
        this._liquidacion
          .crear(liquidacion)
          .pipe(
            switchMap(() =>
              this._inmueblesService.activarInmueble(contrato.inmuebleId),
            ),
            switchMap(() =>
              forkJoin(
                contrato.inquilinos.map((id) =>
                  this._inquilinoService.activarInquilino(id),
                ),
              ),
            ),
          )
          .subscribe({
            next: () => {
              this._snack.mensajeSnackBar(
                'Contrato creado exitosamente',
                'Cerrar',
              );
              this.formulario.reset();
              this.formulario.patchValue({
                id: randomId(),
                propietarios: [],
                estado: 'preliminar',
                tipoDeContrato: 'viviendaPermanente',
              });
              this.$propietarioId.set(0);
              this.busquedaPropietario.setValue('');
            },
            error: () => {
              this._snack.mensajeSnackBar(
                'Contrato creado, pero no se pudieron completar las activaciones relacionadas',
                'Cerrar',
              );
            },
          });
      },
      error: () => {
        this._snack.mensajeSnackBar('Error al crear contrato', 'Cerrar');
      },
    });
  }

  // Las funciones de abajo creo que se podrían mejorar porque apuntan a lo mismo

  nombrePropietario(propietario: IPropietario): string {
    return obtenerCaracteristica(
      propietario,
      'nombre',
      'Nombre no disponible',
    ).toString();
  }
  nombreInquilino(inquilino: IInquilino): string {
    return obtenerCaracteristica(
      inquilino,
      'nombre',
      'Nombre no disponible',
    ).toString();
  }
  nombrePropietarioXId(id: number): string {
    const propietario = this.propietariosLista.find((p) => p.id === id);
    const nombre = propietario
      ? this.nombrePropietario(propietario)
      : 'Nombre no disponible';
    return nombre.split(' ')[0]; // Devuelve solo el primer nombre
  }
  nombreInquilinoXId(id: number): string {
    const inquilino = this.inquilinosLista.find((i) => i.id === id);
    const nombre = inquilino
      ? this.nombreInquilino(inquilino)
      : 'Nombre no disponible';
    return nombre.split(' ')[0]; // Devuelve solo el primer nombre
  }

  //convertir array a la version de Vista
  convertirArrayPropietarios(
    propietarios: IPropietario[],
  ): IPropietarioVista[] {
    const propietariosVista = [];
    for (let p of propietarios) {
      propietariosVista.push(this._propietariosService.convertirAVista(p));
    }
    return propietariosVista;
  }
  convertirArrayInquilinos(inquilinos: IInquilino[]): IInquilinoVista[] {
    const inquilinosVista = [];
    for (let i of inquilinos) {
      inquilinosVista.push(this._inquilinoService.convertirAVista(i));
    }
    return inquilinosVista;
  }

  //manejar la seleccion de propietario en el autocomplete
  obtenerIdDelPropietario(event: MatAutocompleteSelectedEvent) {
    const propietarioId = event.option.value.id;
    const propietariosSeleccionados = this.propietariosSeleccionados;
    if (!propietariosSeleccionados.includes(propietarioId)) {
      this.formulario
        .get('propietarios')
        ?.setValue([...propietariosSeleccionados, propietarioId]);
    }
    if (!this.$propietarioId()) {
      this.$propietarioId.set(propietarioId);
      this.formulario.get('inmuebleId')?.enable();
    }
    this.busquedaPropietario.setValue('');
  }

  quitarPropietario(id: number) {
    const propietariosRestantes = this.propietariosSeleccionados.filter(
      (item) => item !== id,
    );
    this.formulario.get('propietarios')?.setValue(propietariosRestantes);
    if (this.$propietarioId() === id) {
      const propietarioIdActivo = propietariosRestantes[0] ?? 0;
      this.$propietarioId.set(propietarioIdActivo);
      const controlInmuebles = this.formulario.get('inmuebleId');
      controlInmuebles?.reset('');
      if (propietarioIdActivo) {
        controlInmuebles?.enable();
      } else {
        controlInmuebles?.disable();
      }
    }
    this.busquedaPropietario.setValue(this.busquedaPropietario.value);
  }

  obtenerIdDelInquilino(event: MatAutocompleteSelectedEvent) {
    const inquilino = event.option.value as IInquilinoVista;
    const idsSeleccionados = this.inquilinosSeleccionados;
    if (!idsSeleccionados.includes(inquilino.id)) {
      this.formulario
        .get('inquilinos')
        ?.setValue([...idsSeleccionados, inquilino.id]);
    }
    this.busquedaInquilino.setValue('');
  }

  quitarInquilino(id: number) {
    this.formulario
      .get('inquilinos')
      ?.setValue(this.inquilinosSeleccionados.filter((item) => item !== id));
    this.busquedaInquilino.setValue(this.busquedaInquilino.value);
  }
  transformarTipoDeContrato(tipo: tipoDeContrato): string {
    switch (tipo) {
      case 'viviendaPermanente':
        return 'Vivienda permanente';
      case 'comercial':
        return 'Comercial';
      case 'verano':
        return 'Temporada de verano';
      case 'temporadaInvierno':
        return 'Temporada de invierno';
      case 'comodato':
        return 'Comodato';
      default:
        return tipo;
    }
  }
}
