import type { Item } from "../../types/Item";
import { Link } from "react-router-dom";

import {
  itemTypeLabels,
  itemConditionLabels,
  itemStatusLabels,
} from "../../utils/itemLabels";

import styles from "./ItemCard.module.css";
import { getImageUrl } from "../../utils/getImageUrl";

interface ItemCardProps {
  item: Item;
  onDelete?: (itemId: number) => void;
  isOwner?: boolean;
}

function ItemCard({ item, onDelete, isOwner }: ItemCardProps) {
  return (
    <article className={`panel ${styles.card}`}>
      <div className={styles.image}>
        {item.cover_image ? (
          <img
            loading="lazy"
            src={getImageUrl(item.cover_image)}
            alt={item.title}
          />
        ) : (
          <span>{item.type === "book" ? "📚" : "🎲"}</span>
        )}
      </div>

      <div className={styles.content}>
        <h3>{item.title}</h3>

        <p className={styles.description}>
          {item.description || "Nincs leírás."}
        </p>

        <div className={styles.badges}>
          <span>Típus: {itemTypeLabels[item.type]}</span>

          <span>Állapot: {itemConditionLabels[item.item_condition]}</span>

          <span>Státusz: {itemStatusLabels[item.status]}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {isOwner && item.status === "active" && (
          <>
            <Link to={`/edit-item/${item.id}`} className="button buttonPrimary">
              Módosítás
            </Link>

            {onDelete && (
              <button
                className="button buttonDanger"
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

        {!isOwner && (
          <Link to={`/items/${item.id}`} className="button buttonPrimary">
            Részletek
          </Link>
        )}
      </div>
    </article>
  );
}

export default ItemCard;
