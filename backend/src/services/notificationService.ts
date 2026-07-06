import { pool } from "../db/connections";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createNotification = async (
    userId: number,
    type: string,
    message: string,
    link: string
) => {

    const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO notifications (
            user_id,
            type,
            message,
            link
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            userId,
            type,
            message,
            link
        ]
    );

    return result.insertId;
};

export const getNotifications = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT *
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return rows;
};

export const markNotificationAsRead = async (
    notificationId: number,
    userId: number
) => {

    await pool.query(
        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ?
        AND user_id = ?
        `,
        [
            notificationId,
            userId
        ]
    );
};

export const getUnreadNotificationsCount = async (
    userId: number
) => {

    const [rows] = await pool.query<RowDataPacket[]>(
        `
        SELECT
            COUNT(*) AS unread_count
        FROM notifications
        WHERE user_id = ?
        AND is_read = FALSE
        `,
        [userId]
    );

    return rows[0].unread_count;
};
