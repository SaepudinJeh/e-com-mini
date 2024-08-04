export type UserType = {
    id?: number;
    email: string;
    password: string;
    username: string;
    role?: Role;
    createdAt?: Date;
}

export type UserLogin = {
    username: string;
    password: string;
    email: string;
}

export type UserRegister = {
    password: string;
    email: string;
}

export type Role = "admin" | "user"