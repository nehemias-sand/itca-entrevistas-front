import type { Ciclo } from "@/services/ciclo/interfaces/ciclos-response.interface";
import type { Pregunta } from "@/services/pregunta/interface/pregunta-response.interface";

export interface CatalogoPreguntasResponse {
    data: CatalogoPreguntas;
}

export interface CatalogoPreguntas {
    id: number,
    nombre: string;
    descripcion: string;
    preguntas: Pregunta[];
    ciclos: Ciclo[];
}
