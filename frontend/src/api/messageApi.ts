import { API_URL } from "./apiConfig";

export const getMessages = async (
    token: string,
    userId: number
) => {

    const response = await fetch(
        `${API_URL}/messages/user/${userId}`,
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

export const sendMessage = async (
    token: string,
    receiverId: number,
    content: string
) => {

    const response = await fetch(
        `${API_URL}/messages`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                receiverId,
                content
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};

export const markMessagesAsRead = async (
    token: string,
    userId: number
) => {

    await fetch(
        `${API_URL}/messages/user/${userId}/read`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            },
        },
    );
};

export const getUnreadMessagesCount = async (
    token: string,
) => {

    const response = await fetch(
        `${API_URL}/messages/unread-count`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data.unreadCount;
};

export const getConversations = async (
    token: string
) => {

    const response = await fetch(
        `${API_URL}/messages/conversations`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};
