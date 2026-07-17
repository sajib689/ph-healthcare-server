import { Role } from "@prisma/client";

export type IJWTPayload = {
    id: string
    email: string
    role: Role
    iat: number
    exp: number
}