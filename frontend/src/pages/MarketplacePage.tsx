import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

import type { Item } from "../types/Item";
import { getAllItems, getMyItems } from "../api/itemApi";
import ItemCard from "../components/ItemCard/ItemCard";

function MarketplacePage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const allItems = await getAllItems();

      if (!token) {
        setItems(allItems);
        return;
      }
      const myItems = await getMyItems(token);

      const filteredItems = allItems.filter(
        (item: Item) => !myItems.some((myItem: Item) => myItem.id === item.id),
      );

      setItems(filteredItems);
    };

    fetchItems();
  }, [token]);

  return (
    <>
      <h1>Termék Adatlap</h1>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onDelete={() => {}}
          isOwner={false}
        />
      ))}
    </>
  );
}

export default MarketplacePage;
