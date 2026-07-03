import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import type { Conversation } from "../../types/Conversation";

import { getConversations } from "../../api/messageApi";
import { API_URL } from "../../api/apiConfig";

import styles from "./Conversations.module.css";

function Conversations() {
  const { token } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getConversations(token);

        setConversations(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a beszélgetéseket.",
        );
      }
    };

    loadConversations();
  }, [token]);

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>Beszélgetések</h1>

      {conversations.length === 0 ? (
        <p>Még nincsenek beszélgetéseid.</p>
      ) : (
        <div className={styles.list}>

          {conversations.map((conversation) => (
            <Link
              key={conversation.user_id}
              to={`/messages/${conversation.user_id}`}
              className={styles.card}
            >
              <div className={styles.avatar}>
                {conversation.avatar ? (
                  <img
                    src={`${API_URL}/uploads/${conversation.avatar}`}
                    alt={conversation.username}
                  />
                ) : (
                  "👤"
                )}
              </div>

              <div className={styles.info}>
                <h3>{conversation.username}</h3>

                <p>{conversation.last_message}</p>

                <small>
                  {new Date(conversation.last_message_at).toLocaleDateString(
                    "hu-HU",
                  )}
                </small>
              </div>

              {conversation.unread_count > 0 && (
                <span className={styles.badge}>
                  {conversation.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Conversations;
