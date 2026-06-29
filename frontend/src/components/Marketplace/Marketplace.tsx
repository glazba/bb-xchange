import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import type { Item } from "../../types/Item";

import { getAllItems, getMyItems } from "../../api/itemApi";
import ItemCard from "../ItemCard/ItemCard";

import styles from "./Marketplace.module.css";

function MarketplacePage() {
  const { token } = useAuth();

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const allItems = await getAllItems();

        if (!token) {
          setItems(allItems);
          return;
        }

        const myItems = await getMyItems(token);

        const filteredItems = allItems.filter(
          (item) => !myItems.some((myItem) => myItem.id === item.id),
        );

        setItems(filteredItems);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );
      }
    };

    fetchItems();
  }, [token]);

  return (
    <div className={styles.page}>
      <h1>Termék Adatlap</h1>
      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={() => {}}
            isOwner={false}
          />
        ))}
      </div>
    </div>
  );
}

export default MarketplacePage;
