import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { getMyItems, deleteItem } from "../../api/itemApi";

import type { Item } from "../../types/Item";

import ItemCard from "../../components/ItemCard/ItemCard";
import styles from "./MyItems.module.css";

function MyItems() {
  const { token } = useAuth();

  const [items, setItems] = useState<Item[]>([]);

  const handleDelete = async (itemId: number) => {
    if (!token) {
      return;
    }

    try {
      await deleteItem(token, itemId);

      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

      alert("A termék sikeresen törölve.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "A terméket nem sikerült törölni.",
      );
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getMyItems(token);

        setItems(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );

        setItems([]);
      }
    };

    fetchItems();
  }, [token]);

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.header}>
        <h1>Termékeim</h1>

        {items.length === 0 && <p>Még nincsenek feltöltött termékeid.</p>}

        <Link
          to="/create-item"
          className={`button buttonPrimary ${styles.addButton}`}
        >
          +
        </Link>
      </div>

      <div className="grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onDelete={handleDelete} isOwner />
        ))}
      </div>
    </div>
  );
}

export default MyItems;
