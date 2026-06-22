import { Request, Response } from "express";
import { getAllUsers, getUserById, createUser } from "../services/userService";

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

export const registerUser = async (
    req: Request,
    res: Response
) => {
    const {
        username,
        email,
        password,
        city
    } = req.body;

    const userId = await createUser(
        username,
        email,
        password,
        city
    );

    res.status(201).json({
        message: "User created",
        userId
    });
};

