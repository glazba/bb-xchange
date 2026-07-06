import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import { Request, Response } from "express";
import { AuthRequest } from "../types/AuthRequest";

/* import { messages } from "../utils/messages"; */
import { handleControllerError } from "../utils/handleControllerErrors";

import {
    getAllUsers,
    getUserById,
    createUser,
    getUserByEmail,
    getUserWithPasswordById,
    getProfileById,
    getAvatarById,
    updateProfileById,
    updateUserInterests,
    updateAvatarById,
    deleteUserById,
    getPublicProfileById
} from "../services/userService";

import { getActiveItemsByOwnerId } from "../services/itemService";

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
            city,
            bio,
            interests
        } = req.body;

        if (!username || !email || !password || !city) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const userId = await createUser(
            username,
            normalizedEmail,
            password,
            city.trim(),
            bio?.trim() ?? ""
        );

        await updateUserInterests(
            userId,
            interests ?? []
        );

        return res.status(201).json({
            message: "User created",
            userId
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get all users
export const getUsers = async (
    req: Request,
    res: Response
) => {

    try {
        const users = await getAllUsers();

        return res.json(users);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    };
};

//! Get one user
export const getUser = async (
    req: Request,
    res: Response
) => {

    try {
        const user = await getUserById(Number(req.params.id));

        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json(user[0]);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
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

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const users = await getUserByEmail(
            normalizedEmail
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

        return res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
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
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get public profile
export const getPublicProfile = async (
    req: Request,
    res: Response
) => {

    try {
        const profile = await getPublicProfileById(
            Number(req.params.id)
        );

        if (!profile) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json(profile);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
    }
};

//! Get user items
export const getPublicUserItems = async (
    req: Request,
    res: Response
) => {

    try {

        const user = await getPublicProfileById(
            Number(req.params.id)
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const items = await getActiveItemsByOwnerId(user.id);

        return res.json(items);

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
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
            username.trim(),
            city.trim(),
            bio?.trim() ?? ""
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
        return handleControllerError(
            error,
            res
        );
    }
};

//! Upload avatar
export const uploadAvatar = async (
    req: AuthRequest,
    res: Response
) => {

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Nincs kiválasztott kép."
            });
        }

        const userId = req.user!.userId;

        const oldAvatar = await getAvatarById(userId);

        if (oldAvatar?.avatar) {
            const oldPath = path.join(__dirname, "../../uploads", oldAvatar.avatar);

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        const avatarPath = `avatars/${req.file.filename}`;

        await updateAvatarById(userId, avatarPath);

        return res.json({
            message: "Profilkép sikeresen feltöltve.",
            avatar: avatarPath
        });

    } catch (error) {
        return handleControllerError(
            error,
            res
        );
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
        return handleControllerError(
            error,
            res
        );
    }
};
