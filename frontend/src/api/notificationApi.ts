import { API_URL } from "./apiConfig";

export const getNotifications = async (
    token: string
) => {

    const response = await fetch(
        `${API_URL}/notifications`,
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

export const getUnreadNotificationsCount = async (
    token: string
) => {

    const response = await fetch(
        `${API_URL}/notifications/unread-count`,
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

    return data.unreadCount;
};

export const markNotificationAsRead = async (
    token: string,
    notificationId: number
) => {

    const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
            method: "PATCH",
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
