import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { getMyItems, deleteItem } from "../../api/itemApi";

import type { Item } from "../../types/Item";

import ItemCard from "../../components/ItemCard/ItemCard";
import styles from "./MyItems.module.css";
import toast from "react-hot-toast";
import EmptyState from "../EmptyState/EmptyState";

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

      toast.success("A termék sikeresen törölve.");
    } catch (error) {
      toast.error(
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
        toast.error(
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
    <div className={`page ${styles.container}`}>
      <header className={styles.header}>
        <h1>Termékeim</h1>

        <p className={styles.subtitle}>
          Kezeld a feltöltött könyveidet és társasjátékaidat.
        </p>

        <p className={styles.counter}>{items.length} termék</p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon="📚"
          title="Még nincsenek termékeid"
          description="Tölts fel egy könyvet vagy társasjátékot, és kezdj el cserélni."
          action={
            <Link className="button buttonPrimary" to="/create-item">
              Termék hozzáadása
            </Link>
          }
        />
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              isOwner
            />
          ))}
        </div>
      )}

      <Link
        to="/create-item"
        className={`button buttonPrimary ${styles.addButton}`}
      >
        +
      </Link>
    </div>
  );
}

export default MyItems;
