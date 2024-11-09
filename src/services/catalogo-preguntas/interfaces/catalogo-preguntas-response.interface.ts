import type { Ciclo, Pregunta } from "@/services/catalogo/interfaces/catalogos-response.interface";

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
