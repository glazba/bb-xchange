import type { Item } from "../../types/Item";
import { Link } from "react-router-dom";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: Item;
  onDelete?: (itemId: number) => void;
  isOwner?: boolean;
}

function ItemCard({ item, onDelete, isOwner }: ItemCardProps) {
  return (
    <div className={styles.card}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p>Típus: {item.type}</p>
      <p>Állapot: {item.item_condition}</p>
      <p>Státusz: {item.status}</p>
      <div className={styles.buttons}>
        {isOwner && (
          <>
            <Link to={`/edit-item/${item.id}`}>Módosítás</Link>

            {onDelete && (
              <button onClick={() => onDelete(item.id)}>Törlés</button>
            )}
          </>
        )}
        {!isOwner && <Link to={`/items/${item.id}`}>Részletek</Link>}
      </div>
    </div>
  );
}

export default ItemCard;
