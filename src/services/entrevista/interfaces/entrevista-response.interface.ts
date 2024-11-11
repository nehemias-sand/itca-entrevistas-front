import type { Carrera } from "@/services/carrera/interfaces/carreras-response.interface";
import type { Ciclo } from "@/services/ciclo/interfaces/ciclos-response.interface";
import type { Docente } from "@/services/docente/interfaces/docentes-response.interface";
import type { Estudiante } from "@/services/estudiante/interfaces/estudiantes-response.interface";

export interface EntrevistaResponse {
    data: Entrevista;
}

export interface Entrevista {
    id: number,
    aprobada: boolean;
    observaciones: string;
    docente: Omit<Docente, 'carnet' | 'nombres' | 'apellidos'>;
    estudiante: Omit<Estudiante, 'nombres' | 'apellidos' | 'correo' | 'seguimientos_carrera'>;
    carrera: Omit<Carrera, 'facultad' | 'seguimientos'>;
    ciclo: Omit<Ciclo, 'anio' | 'numero' | 'catalogos'>
}

export interface ResultadoEntrevista extends Entrevista {
    preguntas: PreguntaResultadoEntrevista[]
}

export interface PreguntaResultadoEntrevista {
    id: number,
    enunciado: string;
    respuesta: string;
}
