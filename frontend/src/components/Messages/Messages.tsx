import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { useAuth } from "../../hooks/useAuth";

import type { Message } from "../../types/Message";

import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../../api/messageApi";

import styles from "./Messages.module.css";

interface JwtPayload {
  userId: number;
}

function Messages() {
  const { userId } = useParams();

  const { token } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");

  const currentUserId = token ? jwtDecode<JwtPayload>(token).userId : null;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const loadMessages = async () => {
      try {
        const data = await getMessages(token, Number(userId));

        setMessages(data);

        await markMessagesAsRead(token, Number(userId));

        window.dispatchEvent(new Event("messages-read"));
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni az üzeneteket.",
        );
      }
    };

    loadMessages();

    const interval = setInterval(loadMessages, 5000);

    return () => clearInterval(interval);
  }, [token, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!token || !userId) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    try {
      await sendMessage(token, Number(userId), content.trim());

      setContent("");

      const data = await getMessages(token, Number(userId));
      console.log("Messages after send:", data);
      setMessages(data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nem sikerült elküldeni az üzenetet.",
      );
    }
  };

  return (
    <div className={`page ${styles.page}`}>
      <div className={`panel ${styles.chatCard}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Beszélgetés</h1>

          <p className={styles.subtitle}>
            Írj üzenetet és beszélgess a felhasználóval.
          </p>
        </div>

        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.empty}>
              <h3>Még nincsenek üzenetek</h3>

              <p>Írd meg az első üzenetet!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.sender_id === currentUserId
                    ? styles.own
                    : styles.other
                }`}
              >
                <p className={styles.sender}>{message.sender_name}</p>

                <p className={styles.content}>{message.content}</p>

                <small className={styles.date}>
                  {new Date(message.created_at).toLocaleString("hu-HU")}
                </small>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.form}>
          <textarea
            className="textarea"
            placeholder="Írj egy üzenetet..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />

          <button className="button buttonPrimary" onClick={handleSend}>
            Küldés
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;
