import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getItemById } from "../../api/itemApi";
import type { Item } from "../../types/Item";

import {
  itemTypeLabels,
  itemConditionLabels,
  itemStatusLabels,
} from "../../utils/itemLabels";

import styles from "./ItemDetails.module.css";

function ItemDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        alert("A termék nem található.");

        navigate("/items");

        return;
      }

      try {
        const data = await getItemById(id);

        setItem(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a terméket.",
        );

        navigate("/items");
      }
    };

    fetchItem();
  }, [id, navigate]);

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
          <strong>Típus:</strong> {itemTypeLabels[item.type]}
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
        {item.status === "active" && (
          <Link className={styles.button} to={`/offers/create/${item.id}`}>Ajánlat küldése</Link>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;
