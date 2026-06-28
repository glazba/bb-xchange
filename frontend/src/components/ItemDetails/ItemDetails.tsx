import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getItemById } from "../../api/itemApi";
import type { Item } from "../../types/Item";

import {
  itemTypeLables,
  itemConditionLabels,
  itemStatusLabels,
} from "../../utils/itemLabels";

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
      <p className={styles.description}>{item.description}</p>
      <div className={styles.info}>
        <p>
          <strong>Tulajdonos:</strong> {item.owner_name ?? "Ismeretlen"}
        </p>
        <p>
          <strong>Típus:</strong> {itemTypeLables[item.type]}
        </p>
        <p>
          <strong>Állapot:</strong> {itemConditionLabels[item.item_condition]}
        </p>

        <p>
          <strong>Státusz:</strong> {itemStatusLabels[item.status]}
        </p>

        {item.created_at && (
          <p>
            <strong>Létrehozva:</strong>{" "}
            {new Date(item.created_at).toLocaleDateString("hu-HU")}
          </p>
        )}

        {item.updated_at && (
          <p>
            <strong>Szerkesztve:</strong>{" "}
            {new Date(item.updated_at).toLocaleDateString("hu-HU")}
          </p>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;
