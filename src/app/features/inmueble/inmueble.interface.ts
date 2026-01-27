export interface IInmueble{
    id: number
    propietarioId: number,
    caracterisiticas: caracterisitcasInmueble[]
}
export interface caracterisitcasInmueble{
    clave: string,
    valor: any
}
export interface definicionCaracteristicaInmueble{
    clave: string,
    tipo: 'string' | 'number' | 'boolean',
    requerido: boolean
}