import { Response } from "express";
import { messages } from "./messages";

export const handleControllerError = (
    error: unknown,
    res: Response
) => {
    console.error(error);

    return res.status(500).json({
        message: messages.internalError
    });
}
