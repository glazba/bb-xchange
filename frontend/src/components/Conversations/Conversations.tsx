import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import type { Conversation } from "../../types/Conversation";

import { getConversations } from "../../api/messageApi";

import styles from "./Conversations.module.css";
import EmptyState from "../EmptyState/EmptyState";
import { getImageUrl } from "../../utils/getImageUrl";

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
        toast.error(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a beszélgetéseket.",
        );
      }
    };

    loadConversations();
  }, [token]);

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Beszélgetések</h1>

        <p className={styles.subtitle}>{conversations.length} beszélgetés</p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon="💬"
          title="Még nincsenek beszélgetéseid"
          description="Ha valakivel kapcsolatba lépsz egy csereajánlat miatt, itt fogod látni az üzeneteiteket."
        />
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
                    loading="lazy"
                    src={getImageUrl(conversation.avatar)}
                    alt={conversation.username}
                  />
                ) : (
                  "👤"
                )}
              </div>

              <div className={styles.info}>
                <div className={styles.topRow}>
                  <h3>{conversation.username}</h3>

                  <small>
                    {new Date(conversation.last_message_at).toLocaleDateString(
                      "hu-HU",
                    )}
                  </small>
                </div>

                <p>{conversation.last_message}</p>
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
