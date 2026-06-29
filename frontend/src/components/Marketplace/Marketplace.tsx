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
      const allItems = await getAllItems();

      console.log("ALL ITEMS:", allItems);

      if (!Array.isArray(allItems)) {
        console.error("Az API nem tömböt adott vissza:", allItems);
        setItems([]);
        return;
      }

      if (!token) {
        setItems(allItems);
        return;
      }

      const myItems = await getMyItems(token);

      if (!Array.isArray(myItems)) {
        setItems([]);
        return;
      }

      const filteredItems = allItems.filter(
        (item: Item) => !myItems.some((myItem: Item) => myItem.id === item.id),
      );

      setItems(filteredItems);
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
