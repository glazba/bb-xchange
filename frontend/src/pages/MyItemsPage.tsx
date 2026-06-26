import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMyItems } from "../api/itemApi";

import type { Item } from "../types/Item";

function MyItemsPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<Item[]>([]);

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
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </>
  );
}

export default MyItemsPage;
