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
}
