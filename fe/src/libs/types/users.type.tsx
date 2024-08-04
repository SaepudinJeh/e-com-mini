export type UsersType = {
    id: number;
    email: string;
    username: string;
    role: string;
    createdAt: Date;
};

export type UsersDataType = {
    data: UsersType[]
}