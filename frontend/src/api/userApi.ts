import type { UserProfile } from "../types/UserProfile";
import { API_URL } from "./apiConfig";

import type { Item } from "../types/Item";
import type { PublicUserProfile } from "../types/PublicUserProfile";

export const getProfile = async (
    token: string,
): Promise<UserProfile> => {

    const response = await fetch(
        `${API_URL}/users/profile`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }
    return data;
};

export const updateProfile = async (
    token: string,
    username: string,
    city: string,
    bio: string,
    interests: string[]
): Promise<UserProfile> => {

    const response = await fetch(
        `${API_URL}/users/profile`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                username,
                city,
                bio,
                interests
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const uploadAvatar = async (
    token: string,
    file: File
): Promise<{ message: string; avatar: string }> => {

    const formData = new FormData();

    formData.append(
        "avatar",
        file
    );

    const response = await fetch(
        `${API_URL}/users/avatar`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export const deleteProfile = async (
    token: string,
    password: string
) => {

    const response = await fetch(
        `${API_URL}/users/profile`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const getPublicProfile = async (
    userId: number
): Promise<PublicUserProfile> => {

    const response = await fetch(
        `${API_URL}/users/public/${userId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const getPublicUserItems = async (
    userId: number
): Promise<Item[]> => {

    const response = await fetch(
        `${API_URL}/users/public/${userId}/items`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message)
    };

    return data;
};