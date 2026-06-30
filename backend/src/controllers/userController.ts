import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    getUserByEmail,
    getUserWithPasswordById,
    getProfileById,
    updateProfileById,
    updateUserInterests,
    deleteUserById
} from "../services/userService";

import { AuthRequest } from "../types/AuthRequest";

//! Register
export const registerUser = async (
    req: Request,
    res: Response
) => {

    try {
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

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        return res.status(201).json({
            message: "User created",
            userId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//! Get all users
export const getUsers = async (
    req: Request,
    res: Response
) => {

    try {

        const users = await getAllUsers();

        res.json(users);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    };
};

//! Get one user
export const getUser = async (
    req: Request,
    res: Response
) => {

    try {
        const user = await getUserById(String(req.params.id));

        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json(user[0]);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//! Login
export const loginUser = async (
    req: Request,
    res: Response
) => {

    try {
        const {
            email,
            password
        } = req.body;

        const users = await getUserByEmail(
            email
        );

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

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

        return res.json({
            message: "Login successful",
            token
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//! Get profile
export const getProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const profile = await getProfileById(
            req.user!.userId
        );

        if (!profile) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json(profile);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

//! Update profile
export const updateProfile = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const {
            username,
            city,
            bio,
            interests
        } = req.body;

        if (!username) {
            return res.status(400).json({
                message: "A felhasználónév kötelező."
            });
        }

        await updateProfileById(
            req.user!.userId,
            username,
            city,
            bio ?? ""
        );

        await updateUserInterests(
            req.user!.userId,
            interests ?? []
        );

        const profile = await getProfileById(
            req.user!.userId
        );

        return res.json(profile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Belső szerverhiba"
        });
    }
};

//! Delete profile
export const deleteProfile = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "A jelszó megadása kötelező."
            });
        }

        const user = await getUserWithPasswordById(
            req.user!.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "Felhasználó nem található."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Hibás jelszó."
            });
        }

        await deleteUserById(
            req.user!.userId
        );

        return res.json({
            message: "A profil sikeresen törölve"
        });


    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Belső szerverhiba."
        });
    }
};
