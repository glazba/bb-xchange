import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getItemById } from "../../api/itemApi";
import type { Item } from "../../types/Item";

import {
  itemTypeLabels,
  itemConditionLabels,
  itemStatusLabels,
} from "../../utils/itemLabels";

import styles from "./ItemDetails.module.css";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import EmptyState from "../EmptyState/EmptyState";
import { getImageUrl } from "../../utils/getImageUrl";

function ItemDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = useMemo(() => item?.images ?? [], [item?.images]);

  const currentImageIndex = images.findIndex(
    (image) => image.image_url === selectedImage,
  );

  const showPreviousImage = useCallback(() => {
    if (!images.length) {
      return;
    }

    const previousIndex =
      currentImageIndex <= 0 ? images.length - 1 : currentImageIndex - 1;

    setSelectedImage(images[previousIndex].image_url);
  }, [images, currentImageIndex]);

  const showNextImage = useCallback(() => {
    if (!images.length) {
      return;
    }

    const nextIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;

    setSelectedImage(images[nextIndex].image_url);
  }, [images, currentImageIndex]);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        toast("A termék nem található.");

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
        handleApiError(error, navigate);
      }
    };

    fetchItem();
  }, [id, navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) {
        return;
      }

      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        return;
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, showPreviousImage, showNextImage]);

  if (!item) {
    return (
      <EmptyState
        icon="🔍"
        title="A termék nem található"
        description="Lehet, hogy törölték, vagy a hivatkozás hibás."
        action={
          <Link className="button buttonPrimary" to="/marketplace">
            Marketplace
          </Link>
        }
      />
    );
  }

  return (
    <div className={`panel ${styles.container}`}>
      <section className={styles.imageSection}>
        <div className={styles.image}>
          {selectedImage ? (
            <img
              loading="lazy"
              src={getImageUrl(selectedImage)}
              alt={item.title}
              className={styles.mainImage}
              onClick={() => setIsLightboxOpen(true)}
            />
          ) : (
            <span>{item.type === "book" ? "📚" : "🎲"}</span>
          )}
        </div>

        {images.length > 1 && (
          <div className={styles.gallery}>
            {images.map((image) => (
              <img
                loading="lazy"
                key={image.id}
                src={getImageUrl(image.image_url)}
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

          {images.length > 1 && (
            <>
              <button
                className={styles.prevButton}
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
              >
                ❮
              </button>

              <button
                className={styles.nextButton}
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
              >
                ❯
              </button>

              <div className={styles.counter}>
                {Math.max(currentImageIndex + 1, 1)} / {images.length}
              </div>
            </>
          )}
          <div className={styles.image}>
            <img
              loading="lazy"
              src={getImageUrl(selectedImage)}
              alt={item.title}
              className={styles.lightboxImage}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetails;
