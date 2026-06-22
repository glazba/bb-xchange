import { Request, Response } from "express";
import { getAllUsers, getUserById } from "../services/userService";

export const getUsers = async (
    req: Request,
    res: Response
) => {
    const users = await getAllUsers();

    res.json(users);
};

export const getUser = (
    req: Request,
    res: Response
) => {
    const user = getUserById(String(req.params.id));

    res.json(user);
};