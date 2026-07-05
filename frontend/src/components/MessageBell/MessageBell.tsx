import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import { getUnreadMessagesCount } from "../../api/messageApi";

import styles from "./MessageBell.module.css";

function MessageBell() {
  const { token } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadMessagesCount(token);

        setUnreadCount(count);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni az üzeneteket.",
        );
      }
    };

    loadUnreadCount();

    const refresh = () => {
      loadUnreadCount();
    };

    window.addEventListener("messages-read", refresh);

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 15000);

    return () => {
      clearInterval(interval);

      window.removeEventListener("messages-read", refresh);
    };
  }, [token]);

  return (
    <Link to="/messages" className={styles.messageLink}>
      Beszélgetések
      {unreadCount > 0 && (
        <span className={styles.badge}>
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default MessageBell;
