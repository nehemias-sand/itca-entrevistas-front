export interface DocenteResponse {
    data: Docente[];
}

export interface Docente {
    id: number,
    carnet: string;
    nombres: string;
    apellidos: string;
    nombre_completo: string;
}
