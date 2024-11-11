export interface CreatePregunta {
    id: number,
    enunciado: string,
    id_tipo_respuesta: number
}

export type UpdatePregunta = Partial<CreatePregunta>