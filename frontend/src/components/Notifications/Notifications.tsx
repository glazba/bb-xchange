import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

import type { Notification } from "../../types/Notification";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../api/notificationApi";

import styles from "./Notifications.module.css";
import { handleApiError } from "../../utils/handleApiError";

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
        handleApiError(error, navigate);
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
      toast.error(error instanceof Error ? error.message : "Hiba történt.");
    }
  };

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Értesítések</h1>

        <p className={styles.subtitle}>{notifications.length} értesítés</p>
      </div>

      {notifications.length === 0 ? (
        <div className={`panel ${styles.empty}`}>
          <h3>Nincsenek értesítéseid</h3>

          <p>
            Az új ajánlatokkal, elfogadásokkal és egyéb eseményekkel kapcsolatos
            értesítések itt fognak megjelenni.
          </p>
        </div>
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
              <div className={styles.content}>
                <p>{notification.message}</p>

                <small>
                  {new Date(notification.created_at).toLocaleString("hu-HU")}
                </small>
              </div>

              {!notification.is_read && <span className={styles.dot} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
