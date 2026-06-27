import type { Item } from "../../types/Item";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: Item;
  onDelete: (itemId: number) => void;
}

function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <div className={styles.card}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p>Típus: {item.type}</p>
      <p>Állapot: {item.item_condition}</p>
      <p>Státusz: {item.status}</p>
      <div className={styles.buttons}>
        <button>Megnyitás</button>
        <button>Módosítás</button>
        <button onClick={() => onDelete(item.id)}>Törlés</button>
      </div>
    </div>
  );
}

export default ItemCard;
