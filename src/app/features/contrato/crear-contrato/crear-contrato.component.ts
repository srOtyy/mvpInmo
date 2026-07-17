import { Component, OnInit,ChangeDetectionStrategy, signal } from '@angular/core';
import { ContratoBbddService } from '../contrato-bbdd.service';
import { SnackbarService } from '../../../core/snackbar.service';
import { IContrato,TipoPago } from '../contrato.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IPropietario, IPropietarioVista } from '../../propietario/propietario.interface';
import { IInquilino, IInquilinoVista } from '../../inquilino/inquilino.interface';
import { obtenerCaracteristica } from '../../caracteristicas/entity-helpers';
import { randomId } from '../../../shared/utilitys';
import { LiquidacionGeneratorService } from '../../liquidacion/liquidacion.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { CicloDeVidaContratosService } from '../ciclo-de-vida-contratos.service';
import { PropietarioRxjsService } from '../../propietario/propietario-rxjs.service';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { InquilinoRxjsService } from '../../inquilino/inquilino-rxjs.service';
@Component({
  selector: 'app-crear-contrato',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule, MatSelectModule, MatButtonModule, MatFormFieldModule, MatDatepickerModule, MatAutocompleteModule,AsyncPipe],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss'
})
export class CrearContratoComponent implements OnInit {
  formulario: FormGroup = new FormGroup({});
  tipoPagoOpciones: TipoPago[] = ['efectivo','transferencia'];
  propietariosFiltrados!: Observable<IPropietarioVista[]>
  inquilinosFiltrados!: Observable<IInquilinoVista[]>
  $propietarioId = signal<number>(0)
  $inquilinoId = signal<number>(0)
  constructor(
    private contratosService: ContratoBbddService,
    private _snack: SnackbarService,
    private _liquidacion: LiquidacionGeneratorService,
    private _cicloDeVida: CicloDeVidaContratosService,
    private _propietariosService: PropietarioRxjsService,
    private _inquilinoService: InquilinoRxjsService
  ){ 
    this.formulario = new FormGroup({
      id: new FormControl(randomId(), Validators.required), 
      propietarioId: new FormControl('', Validators.required),
      inmuebleId: new FormControl({ value: '', disabled: true }, Validators.required),
      inquilinoId: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      rentaMensual: new FormControl('', [Validators.required, Validators.min(0)]),
      estado: new FormControl('preliminar', Validators.required),
      periodoAumento: new FormControl('',[Validators.required,Validators.min(0)]),
      proximoAumento: new FormControl(''),
      titulo: new FormControl(''),
      porcentajeHonorarios: new FormControl('',[Validators.required,Validators.min(0)]),
      tipoPago: new FormControl('',Validators.required),
      inicioDelPeriodo: new FormControl('1',[Validators.max(31),Validators.min(1)])
      });
    }

  async ngOnInit(): Promise<void> {
    await this.contratosService.obtenerListas().catch(error => {
        console.error('Error al cargar las listas para el formulario de contratos:', error);
        this._snack.mensajeSnackBar('Error al cargar datos para el formulario', 'Cerrar');
    });   
    this.propietariosFiltrados = this.formulario.get('propietarioId')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.nombre),
      map(nombre => nombre ? this._filtrarPropietarios(nombre) : this.propietariosLista.slice())
    )
    this.inquilinosFiltrados = this.formulario.get('inquilinoId')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value?.nombre),
      map(nombre => nombre ? this._filtrarInquilinos(nombre) : this.inquilinosLista.slice())
    )

  }
  // para el oninit del observable para inquilinos y propietarios (autocomplete)
  private _filtrarPropietarios(nombre: string): IPropietarioVista[] {
    const filterValue = nombre.toLowerCase();
    return this.propietariosLista.filter(p => p.nombre.toLowerCase().includes(filterValue));
  }
  displayPropietario(propietario: IPropietarioVista): string {
    return propietario?.nombre ?? '';
  }
  private _filtrarInquilinos(nombre: string): IInquilinoVista[]{
    const filterValue = nombre.toLowerCase();
    return this.inquilinosLista.filter(i => i.nombre.toLowerCase().includes(filterValue));
  }
  displayInquilino(inquilino: IInquilinoVista):string{
    return inquilino?.nombre?? ''
  }



  //getters
  get propietariosLista() {
    return this.convertirArrayPropietarios(this.contratosService.$listaPropietarios);
  }
  get inquilinosLista() {
    return this.convertirArrayInquilinos(this.contratosService.$listaInquilinos)
  }
  get inmueblesLista() {
     return this.contratosService.$listaInmuebles;
  }
  get filteredInmueblesLista() {
     const propietarioId = this.$propietarioId()
     if (!propietarioId) {
       return this.inmueblesLista;
     }
     return this.inmueblesLista.filter(inmueble => inmueble.idPropietario === propietarioId);
  }

  //submit
  enviarContrato(){
    this.formulario.patchValue({ propietarioId: this.$propietarioId() });
    this.formulario.patchValue({ inquilinoId: this.$inquilinoId() });
    const contrato: IContrato = this.formulario.value
    if(this.formulario.get('titulo')?.value === ''){
      contrato.titulo = this.contratosService.generarTituloContrato(contrato.propietarioId.toString(), contrato.inquilinoId.toString());
    }
    contrato.proximoAumento = this.contratosService.declararProximoMesDeAumento(contrato.periodoAumento, contrato.fechaInicio);
    contrato.estadoRenovacion = this._cicloDeVida.calcularEstadoDeRenovacion(this._cicloDeVida.calcularDiasRestantes(contrato.proximoAumento))
    console.log(this.formulario.value)
    this.contratosService.crear(contrato).subscribe({
      next: () => {
        this._snack.mensajeSnackBar('Contrato creado exitosamente', 'Cerrar');
        /*
        En este lugar se tiene que crear la liquidacion del contrato. ¿Que datos necesito para crear la liquidacion? El contrato, el nombre del propietario, el nombre del inquilino y los items de la liquidacion. 
        */
        const liquidacion = this._liquidacion.crearLiquidacion(contrato, this.nombrePropietarioXId(contrato.propietarioId), this.nombreInquilinoXId(contrato.inquilinoId));
        //suscripcion innecesaria ? o tengo que volverlo una promesa ? 
        this._liquidacion.crear(liquidacion).subscribe({
          next: () => {
          },
          error: () => {
            console.error("Error al crear la liquidacion");
          }
        });
        this.formulario.reset();
        this.formulario.markAllAsTouched();
      },
      error: () => {
        this._snack.mensajeSnackBar('Error al crear contrato', 'Cerrar');
      }
    })
  }
  

  // Las funciones de abajo creo que se podrían mejorar porque apuntan a lo mismo
  
  nombrePropietario(propietario: IPropietario): string {
    return obtenerCaracteristica(propietario, 'nombre', 'Nombre no disponible').toString();
  }
  nombreInquilino(inquilino: IInquilino): string {
    return obtenerCaracteristica(inquilino, 'nombre', 'Nombre no disponible').toString();
  }
  nombrePropietarioXId(id: number): string {
    const propietario = this.propietariosLista.find(p => p.id === id);
    return propietario ? this.nombrePropietario(propietario) : 'Nombre no disponible';
  }
  nombreInquilinoXId(id: number): string {
    const inquilino = this.inquilinosLista.find(i => i.id === id);
    return inquilino ? this.nombreInquilino(inquilino) : 'Nombre no disponible';
  }

  //convertir array a la version de Vista
  convertirArrayPropietarios(propietarios: IPropietario[]): IPropietarioVista[]{
    const propietariosVista = []
    for(let p of propietarios){
      propietariosVista.push(this._propietariosService.convertirAVista(p))
    }
    return propietariosVista
  }
  convertirArrayInquilinos(inquilinos: IInquilino[]): IInquilinoVista[]{
    const inquilinosVista = []
    for(let i of inquilinos){
      inquilinosVista.push(this._inquilinoService.convertirAVista(i))
    }
    return inquilinosVista
  }

  //manejar la seleccion de propietario en el autocomplete
  obtenerIdDelPropietario(event: MatAutocompleteSelectedEvent){
    const propietarioId = event.option.value.id;
    this.$propietarioId.set(propietarioId)
    const controlInmuebles = this.formulario.get('inmuebleId')
    controlInmuebles?.enable()

  }
  obtenerIdDelInquilino(event :MatAutocompleteSelectedEvent){
    this.$inquilinoId.set(event.option.value.id)
  }
}
