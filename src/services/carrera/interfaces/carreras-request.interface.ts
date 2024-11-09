export interface CreateCarrera {
    id: number;
    nombre: string,
    id_facultad: number;
    seguimientos: Seguimiento[];
}

export interface Seguimiento {
    id_jornada: number;
    id_modalidad: number;
    id_regional: number;
    id_coordinador: number;
}

export type UpdateCarrera = Partial<CreateCarrera>