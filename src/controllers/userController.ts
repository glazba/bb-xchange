import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import { getAllUsers, getUserById, createUser, getUserByEmail } from "../services/userService";

//! Register
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

    res.json(user[0]);
};

//! Login
export const loginUser = async (
    req: Request,
    res: Response
) => {

    const {
        email,
        password
    } = req.body;

    const users = await getUserByEmail(
        email
    );

    if (users.length === 0) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(
        password, user.password_hash
    );

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1d"
        }
    );

    res.json({
        message: "Login successful",
        token
    });
};
