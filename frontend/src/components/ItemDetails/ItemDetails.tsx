import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getItemById } from "../../api/itemApi";
import type { Item } from "../../types/Item";

import styles from "./ItemDetails.module.css";

function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        return;
      }

      const data = await getItemById(id);

      setItem(data);
    };

    fetchItem();
  }, [id]);

  if (!item) {
    return <p>Betöltés...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.image}>{item.type === "book" ? "📚" : "🎲"}</div>
      <h1>{item.title}</h1>
      <div className={styles.badges}>
        <p>Típus: {item.type}</p>
        <p>{item.description}</p>
        <p>Állapot: {item.item_condition}</p>
        <p>Státusz: {item.status}</p>
      </div>
    </div>
  );
}

export default ItemDetails;
