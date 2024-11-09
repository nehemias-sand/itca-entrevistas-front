import type { Docente } from "@/services/docente/interfaces/docentes-response.interface";
import type { Estudiante } from "@/services/estudiante/interfaces/estudiantes-response.interface";

export interface EntrevistaResponse {
    data: Entrevista;
}

export interface Entrevista {
    id: number,
    aprobada: boolean;
    observaciones: string;
    docente: Docente;
    estudiante: Estudiante;
}
