import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import type { Notification } from "../../types/Notification";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notificationApi";

import styles from "./Notifications.module.css";

function Notifications() {
  const { token } = useAuth();

  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getNotifications(token);

        setNotifications(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni az értesítéseket.",
        );
      }
    };

    loadNotifications();
  }, [token]);

  const handleClick = async (notification: Notification) => {
    if (!token) {
      return;
    }

    try {
      if (!notification.is_read) {
        await markNotificationAsRead(token, notification.id);

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item,
          ),
        );

        window.dispatchEvent(new Event("notifications-read"));
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Hiba történt.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Értesítések</h1>

      {notifications.length === 0 ? (
        <p>Nincsenek értesítéseid.</p>
      ) : (
        <div className={styles.list}>
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`${styles.card} ${
                !notification.is_read ? styles.unread : ""
              }`}
              onClick={() => handleClick(notification)}
            >
              <p>{notification.message}</p>

              <small>
                {new Date(notification.created_at).toLocaleString("hu-HU")}
              </small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
