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
import { API_URL } from "../../api/apiConfig";

function ItemDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
        }
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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!item) {
    return <p>Betöltés...</p>;
  }

  return (
    <div className={`panel ${styles.container}`}>
      <section className={styles.imageSection}>
        <div className={styles.image}>
          {selectedImage ? (
            <img
              src={`${API_URL}/uploads/${selectedImage}`}
              alt={item.title}
              className={styles.mainImage}
              onClick={() => setIsLightboxOpen(true)}
            />
          ) : (
            <span>{item.type === "book" ? "📚" : "🎲"}</span>
          )}
        </div>

        {item.images && item.images.length > 1 && (
          <div className={styles.gallery}>
            {item.images.map((image) => (
              <img
                key={image.id}
                src={`${API_URL}/uploads/${image.image_url}`}
                alt={item.title}
                className={
                  selectedImage === image.image_url
                    ? styles.activeThumbnail
                    : styles.thumbnail
                }
                onClick={() => setSelectedImage(image.image_url)}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.content}>
        <h1 className={styles.title}>{item.title}</h1>

        <div className={styles.badges}>
          <span>{itemTypeLabels[item.type]}</span>

          <span>{itemConditionLabels[item.item_condition]}</span>

          <span>{itemStatusLabels[item.status]}</span>
        </div>

        <div className={styles.owner}>
          <strong>Tulajdonos:</strong>{" "}
          <Link to={`/users/${item.owner_id}`}>{item.owner_name}</Link>
        </div>

        <div className={styles.descriptionBox}>
          <h3>Leírás</h3>

          <p>{item.description || "Nincs leírás."}</p>
        </div>

        <div className={styles.detailsGrid}>
          {item.type === "book" && (
            <>
              <div>
                <strong>Szerző</strong>
                <span>{item.author || "-"}</span>
              </div>

              <div>
                <strong>Műfaj</strong>
                <span>{item.genre || "-"}</span>
              </div>

              <div>
                <strong>Oldalszám</strong>
                <span>{item.page_count ?? "-"}</span>
              </div>

              <div>
                <strong>Kiadás éve</strong>
                <span>{item.published_year ?? "-"}</span>
              </div>

              <div>
                <strong>ISBN</strong>
                <span>{item.isbn || "-"}</span>
              </div>
            </>
          )}

          {item.type === "boardgame" && (
            <>
              <div>
                <strong>Műfaj</strong>
                <span>{item.genre || "-"}</span>
              </div>

              <div>
                <strong>Minimum játékos</strong>
                <span>{item.min_players ?? "-"}</span>
              </div>

              <div>
                <strong>Maximum játékos</strong>
                <span>{item.max_players ?? "-"}</span>
              </div>

              <div>
                <strong>Ajánlott életkor</strong>
                <span>{item.recommended_age ?? "-"}</span>
              </div>

              <div>
                <strong>Játékidő</strong>
                <span>{item.playtime ? `${item.playtime} perc` : "-"}</span>
              </div>
            </>
          )}

          {item.created_at && (
            <div>
              <strong>Létrehozva</strong>
              <span>
                {new Date(item.created_at).toLocaleDateString("hu-HU")}
              </span>
            </div>
          )}

          {item.updated_at && (
            <div>
              <strong>Szerkesztve</strong>
              <span>
                {new Date(item.updated_at).toLocaleDateString("hu-HU")}
              </span>
            </div>
          )}
        </div>

        {item.status === "active" && (
          <Link
            className={`button buttonSuccess ${styles.offerButton}`}
            to={`/offers/create/${item.id}`}
          >
            Ajánlat küldése
          </Link>
        )}
      </section>

      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className={styles.closeButton}
            onClick={(event) => {
              event.stopPropagation();
              setIsLightboxOpen(false);
            }}
          >
            ✕
          </button>

          <img
            src={`${API_URL}/uploads/${selectedImage}`}
            alt={item.title}
            className={styles.lightboxImage}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ItemDetails;
