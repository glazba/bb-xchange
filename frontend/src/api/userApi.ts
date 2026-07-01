import type { UserProfile } from "../types/UserProfile";

export const getProfile = async (
    token: string,
): Promise<UserProfile> => {

    const response = await fetch(
        "http://localhost:3000/users/profile",
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
        "http://localhost:3000/users/profile",
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
        "http://localhost:3000/users/avatar",
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
        "http://localhost:3000/users/profile",
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
