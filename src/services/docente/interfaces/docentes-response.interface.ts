import type { User } from "@/services/auth/interfaces/login-response.interface";
import type { Cargo, Facultad } from "@/services/catalogo/interfaces/catalogos-response.interface";

export interface DocenteResponse {
    data: Docente[];
}

export interface Docente {
    id: number;
    carnet: string;
    nombres: string;
    apellidos: string;
    nombre_completo: string;
    facultad: Facultad;
    cargo: Cargo;
    usuario: Omit<User, 'username'| 'email_verified_at' | 'perfil' | 'activo'>
}
