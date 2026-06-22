import { Request, Response } from "express";
import { getAllUsers, getUserById } from "../services/userService";

export const getUsers = async (
    req: Request,
    res: Response
) => {
    const users = await getAllUsers();

    res.json(users);
};

export const getUser = async (
    req: Request,
    res: Response
) => {
    const user = await getUserById(String(req.params.id));

    if (user.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
};