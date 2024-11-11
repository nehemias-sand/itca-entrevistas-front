export interface CreateDocente {
    id: number,
    carnet: string,
    nombres: string,
    apellidos: string,
    email: string,
    id_cargo: number,
    id_facultad: number
}

export type UpdateDocente = Partial<CreateDocente>