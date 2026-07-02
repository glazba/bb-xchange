import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Item } from "../../types/Item";

import { getPublicUserItems } from "../../api/userApi";

import ItemCard from "../ItemCard/ItemCard";

import styles from "./PublicUserItems.module.css";

function PublicUserItems() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        const data = await getPublicUserItems(Number(id));

        setItems(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );

        navigate("/");
      }
    };

    fetchItems();
  }, [id, navigate]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Felhasználó termékei</h1>

      {items.length === 0 ? (
        <p>Nincsenek aktív termékei.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicUserItems;
