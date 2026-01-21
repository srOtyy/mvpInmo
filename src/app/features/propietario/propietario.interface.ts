export interface IPropietario{
    id: number,
    nombre: string,
    dni: number,
    telefono: number,
    email: string,
    cbu: string,
    inmuebles: string[]
    //La propiedad inmuebles es un array de IDs de los inmuebles que posee el propietario 

}