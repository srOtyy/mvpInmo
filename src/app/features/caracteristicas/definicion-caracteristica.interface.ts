export interface DefinicionCaracteristica {
  clave: string;
  tipo: 'texto' | 'numero' | 'booleano' ;
  requerido: boolean;
  opciones?: string[];
}
