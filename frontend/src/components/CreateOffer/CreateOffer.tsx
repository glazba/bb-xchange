import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Item } from "../../types/Item";

import { useAuth } from "../../hooks/useAuth";
import { getMyItems } from "../../api/itemApi";
import { createOffer } from "../../api/tradeOfferApi";

import styles from "./CreateOffer.module.css";
import toast from "react-hot-toast";
import EmptyState from "../EmptyState/EmptyState";

function CreateOffer() {
  const { itemId } = useParams();

  const { token } = useAuth();

  const navigate = useNavigate();

  const [myItems, setMyItems] = useState<Item[]>([]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getMyItems(token);

        const activeItems = data.filter((item) => item.status === "active");

        if (activeItems.length === 0) {
          setMyItems([]);

          return;
        }

        setMyItems(activeItems);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );
      }
    };

    fetchItems();
  }, [token, navigate]);

  const handleItemToggle = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSubmit = async () => {
    if (!token) {
      return;
    }

    if (!itemId) {
      toast("A termék nem található.");

      navigate("/");

      return;
    }

    if (selectedItems.length === 0) {
      toast("Válassz legalább egy terméket!");

      return;
    }

    try {
      await createOffer(token, Number(itemId), selectedItems);

      toast.success("Ajánlat elküldve.");

      navigate("/offers");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Az ajánlatot nem sikerült elküldeni.",
      );
    }
  };

  return (
    <div className={`formCard ${styles.container}`}>
      {myItems.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Nincs felajánlható terméked"
          description="Először hozz létre egy aktív könyvet vagy társasjátékot, amelyet cserére ajánlhatsz."
          action={
            <Link className="button buttonPrimary" to="/create-item">
              Termék hozzáadása
            </Link>
          }
        />
      ) : (
        <>
          <div className={styles.header}>
            <h1>Ajánlat küldése</h1>

            <p>
              Válaszd ki azokat a saját termékeidet, amelyeket felajánlasz
              cserére.
            </p>
          </div>

          <div className={styles.checkboxGroup}>
            {myItems.map((item) => (
              <label
                key={item.id}
                className={`${styles.checkbox} ${
                  selectedItems.includes(item.id) ? styles.selected : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemToggle(item.id)}
                />

                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{item.title}</span>

                  <small>
                    {item.type === "book" ? "📚 Könyv" : "🎲 Társasjáték"}
                  </small>
                </div>
              </label>
            ))}
          </div>

          <div className={styles.footer}>
            <p className={styles.counter}>
              {selectedItems.length} termék kiválasztva
            </p>

            <button className="button buttonSuccess" onClick={handleSubmit}>
              Ajánlat küldése ({selectedItems.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateOffer;
