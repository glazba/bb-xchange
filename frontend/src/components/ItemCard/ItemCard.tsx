import type { Item } from "../../types/Item";
import { Link } from "react-router-dom";

import {
  itemTypeLabels,
  itemConditionLabels,
  itemStatusLabels,
} from "../../utils/itemLabels";

import styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: Item;
  onDelete?: (itemId: number) => void;
  isOwner?: boolean;
}

function ItemCard({ item, onDelete, isOwner }: ItemCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        {item.cover_image ? (
          <img
            src={`http://localhost:3000/uploads/${item.cover_image}`}
            alt={item.title}
          />
        ) : (
          <span>{item.type === "book" ? "📚" : "🎲"}</span>
        )}
      </div>{" "}
      <h3>{item.title}</h3>
      <div className={styles.badges}>
        <span>Típus: {itemTypeLabels[item.type]}</span>
        <span>Állapot: {itemConditionLabels[item.item_condition]}</span>
        <span>Státusz: {itemStatusLabels[item.status]}</span>
      </div>
      <p>{item.description}</p>
      <div className={styles.buttons}>
        {isOwner && item.status === "active" && (
          <>
            <Link to={`/edit-item/${item.id}`}>Módosítás</Link>

            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm("Biztosan törölni szeretnéd?")) {
                    onDelete(item.id);
                  }
                }}
              >
                Törlés
              </button>
            )}
          </>
        )}
        {!isOwner && <Link to={`/items/${item.id}`}>Részletek</Link>}
      </div>
    </div>
  );
}

export default ItemCard;
