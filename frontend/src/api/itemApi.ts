import type { Item } from "../types/Item";

import { API_URL } from "./apiConfig";

export const createItem = async (
    token: string,
    itemData: Partial<Item>
): Promise<{ message: string; itemId: number }> => {

    const response = await fetch(
        `${API_URL}/items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};


export const getAllItems = async ()
    : Promise<Item[]> => {
    const response = await fetch(
        `${API_URL}/items`
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const getMyItems = async (
    token: string,
): Promise<Item[]> => {

    const response = await fetch(
        `${API_URL}/items/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const getItemById = async (
    itemId: string
): Promise<Item> => {
    const response = await fetch(
        `${API_URL}/items/${itemId}`
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const updateItem = async (
    token: string,
    itemId: string,
    itemData: Partial<Item>
): Promise<Item> => {

    const response = await fetch(
        `${API_URL}/items/${itemId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};


export const deleteItem = async (
    token: string,
    itemId: number
): Promise<Item> => {

    const response = await fetch(
        `${API_URL}/items/${itemId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

//! Upload item images
export const uploadItemImages = async (
    token: string,
    itemId: number,
    files: File[]
) => {

    const formData = new FormData();

    files.forEach((file) => {
        formData.append(
            "images",
            file
        );
    });

    const response = await fetch(
        `${API_URL}/items/${itemId}/images`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const setItemCoverImage = async (
    token: string,
    imageId: number
) => {

    const response = await fetch(
        `${API_URL}/items/images/${imageId}/cover`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        },
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};

export const deleteItemImage = async (
    token: string,
    imageId: number
) => {

    const response = await fetch(
        `${API_URL}/items/images/${imageId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message);
        (error as Error & { status?: number }).status = response.status;

        throw error;
    }

    return data;
};
