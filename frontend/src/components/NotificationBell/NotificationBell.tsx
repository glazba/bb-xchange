import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import { getUnreadNotificationsCount } from "../../api/notificationApi";

import styles from "./NotificationBell.module.css";

function NotificationBell() {
  const { token } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationsCount(token);

        setUnreadCount(count);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni az értesítéseket.",
        );
      }
    };

    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 5000);

    const refresh = () => {
      loadUnreadCount();
    };

    window.addEventListener("notifications-read", refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-read", refresh);
    };
  }, [token]);

  return (
    <Link to="/notifications" className={styles.bell}>
      🔔
      {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
    </Link>
  );
}

export default NotificationBell;
