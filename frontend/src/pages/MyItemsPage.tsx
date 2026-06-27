import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMyItems, deleteItem } from "../api/itemApi";

import type { Item } from "../types/Item";
import ItemCard from "../components/ItemCard/ItemCard";

function MyItemsPage() {
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
    <>
      <h1>Termékeim</h1>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </>
  );
}

export default MyItemsPage;
