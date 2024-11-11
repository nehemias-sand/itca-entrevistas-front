export interface CreateCiclo {
    id: number,
    anio: number,
    num: number,
    codigo: string
}

export type UpdateCiclo = Partial<CreateCiclo>