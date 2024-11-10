import type { Carrera } from '../../carrera/interfaces/carreras-response.interface';

export interface FacultadResponse {
  data: Facultad[]
}

export interface JornadaResponse {
  data: Jornada[]
}

export interface ModalidadResponse {
  data: Modalidad[]
}

export interface RegionalResponse {
  data: Regional[]
}

export interface CarreraCatalogoResponse {
    data: Carrera[];
}

export interface Facultad {
  id: number
  codigo: string
  nombre: string
}

export interface Jornada {
  id: number
  nombre: string
}

export interface Modalidad {
  id: number
  nombre: string
}

export interface Regional {
  id: number
  nombre: string
  telefono: string
}
