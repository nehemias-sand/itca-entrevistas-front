import type { Facultad, Jornada, Modalidad, Regional } from "@/services/catalogo/interfaces/catalogos-response.interface";
import type { Docente } from "@/services/docente/interfaces/docentes-response.interface";

export interface CarreraResponse {
    data: Carrera;
}

export interface Carrera {
    id: number,
    nombre: string;
    facultad: Facultad;
    seguimientos: SeguimientoCarrera[]
}

export interface SeguimientoCarrera {
    id: number;
    jornada: Jornada;
    modalidad: Modalidad;
    regional: Regional;
    coordinador: Docente
}
