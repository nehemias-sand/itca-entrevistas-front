export interface CreateEstudiate {
    id: number,
    nombres: string,
    apellidos: string,
    correo: string,
    id_carrera: number,
    id_jornada: number,
    id_modalidad: number,
    id_regional: number
}

export type UpdateEstudiante = Omit<CreateEstudiate, 'id'| 'id_carrera' | 'id_jornada' | 'id_modalidad' | 'id_regional'>
