import { Request } from "express";

//! Extended Req Type
export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string
    };
}
