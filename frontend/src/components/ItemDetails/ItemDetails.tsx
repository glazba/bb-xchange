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

        {item.type === "book" && (
          <>
            <p>
              <strong>Szerző:</strong> {item.author || "-"}
            </p>

            <p>
              <strong>Műfaj:</strong> {item.genre || "-"}
            </p>

            <p>
              <strong>Oldalszám:</strong> {item.page_count ?? "-"}
            </p>

            <p>
              <strong>Kiadás éve:</strong> {item.published_year ?? "-"}
            </p>

            <p>
              <strong>ISBN:</strong> {item.isbn || "-"}
            </p>
          </>
        )}

        {item.type === "boardgame" && (
          <>
            <p>
              <strong>Műfaj:</strong> {item.genre || "-"}
            </p>

            <p>
              <strong>Minimum játékos:</strong> {item.min_players ?? "-"}
            </p>

            <p>
              <strong>Maximum játékos:</strong> {item.max_players ?? "-"}
            </p>

            <p>
              <strong>Ajánlott életkor:</strong> {item.recommended_age ?? "-"}
            </p>

            <p>
              <strong>Játékidő:</strong>{" "}
              {item.playtime ? `${item.playtime} perc` : "-"}
            </p>
          </>
        )}

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
          <Link className={styles.button} to={`/offers/create/${item.id}`}>
            Ajánlat küldése
          </Link>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;
