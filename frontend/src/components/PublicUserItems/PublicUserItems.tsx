import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Item } from "../../types/Item";

import { getPublicUserItems } from "../../api/userApi";

import ItemCard from "../ItemCard/ItemCard";

import styles from "./PublicUserItems.module.css";
import { handleApiError } from "../../utils/handleApiError";

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
        handleApiError(error, navigate);
      }
    };

    fetchItems();
  }, [id, navigate]);

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Felhasználó termékei</h1>

        <p className={styles.subtitle}>{items.length} aktív termék</p>
      </div>

      {items.length === 0 ? (
        <div className={`panel ${styles.empty}`}>
          <h3>Nincsenek aktív termékek</h3>

          <p>
            Ez a felhasználó jelenleg nem töltött fel cserére elérhető könyvet
            vagy társasjátékot.
          </p>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicUserItems;
