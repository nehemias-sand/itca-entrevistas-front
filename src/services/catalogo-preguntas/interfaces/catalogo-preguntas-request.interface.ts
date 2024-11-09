export interface CreateCatalogoPreguntas {
    id: number;
    nombre: string,
    descripcion: string ;
    ids_pregunta: number[];
    ids_ciclo: number[];
}

export type UpdateCatalogoPreguntas = Partial<CreateCatalogoPreguntas>
