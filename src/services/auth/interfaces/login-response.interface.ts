export interface LoginResponse {
    data: Data;
}

export interface Data {
    user: User;
    token: string;
}

export interface User {
    id: number,
    username: string;
    email: string;
    email_verified_at: string;
    perfil: string;
    activo: boolean;
}

export type RegisterAdmin = Omit<User, 'id' | 'email_verified_at' | 'perfil' | 'activo'>

export type UpdateUser = Partial<RegisterAdmin>