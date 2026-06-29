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

    await deleteItem(token, itemId);

    setItems(items.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        return;
      }

      const data = await getMyItems(token);

      setItems(data);
    };
    fetchItems();
  }, [token]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Termékeim</h1>
        <Link to="/create-item" className={styles.addButton}>
          +
        </Link>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={handleDelete}
            isOwner={true}
          />
        ))}
      </div>
    </div>
  );
}

export default MyItems;
