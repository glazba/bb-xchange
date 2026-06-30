import type { Item } from "../types/Item";

export const createItem = async (
    token: string,
    itemData: Partial<Item>
): Promise<Item> => {

    const response = await fetch(
        "http://localhost:3000/items",
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
        throw new Error(data.message);
    }

    return data;
};


export const getAllItems = async ()
    : Promise<Item[]> => {
    const response = await fetch(
        "http://localhost:3000/items"
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const getMyItems = async (
    token: string,
): Promise<Item[]> => {

    const response = await fetch(
        "http://localhost:3000/items/me",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const getItemById = async (
    itemId: string
): Promise<Item> => {
    const response = await fetch(
        `http://localhost:3000/items/${itemId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};


export const updateItem = async (
    token: string,
    itemId: string,
    itemData: Partial<Item>
): Promise<Item> => {

    const response = await fetch(
        `http://localhost:3000/items/${itemId}`,
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
        throw new Error(data.message);
    }

    return data;
};


export const deleteItem = async (
    token: string,
    itemId: number
): Promise<Item> => {

    const response = await fetch(
        `http://localhost:3000/items/${itemId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};
