export interface CreateEntrevista {
    aprobada: boolean,
    observaciones: string ;
    id_estudiante: number;
    id_ciclo: number;
    id_catalogo: number;
    id_carrera: number;
    seguimientos: SeguimientosEntrevista[];
}

export interface SeguimientosEntrevista {
    id_pregunta: number;
    respuesta: string;
}
