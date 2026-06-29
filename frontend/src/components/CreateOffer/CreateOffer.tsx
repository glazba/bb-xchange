import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Item } from "../../types/Item";

import { useAuth } from "../../hooks/useAuth";
import { getMyItems } from "../../api/itemApi";
import { createOffer } from "../../api/tradeOfferApi";

import styles from "./CreateOffer.module.css";

function CreateOffer() {
  const { itemId } = useParams();

  const { token } = useAuth();

  const navigate = useNavigate();

  const [myItems, setMyItems] = useState<Item[]>([]);

  const [selectedItemId, setSelectedItemId] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getMyItems(token);

        const activeItems = data.filter((item) => item.status === "active");

        if (activeItems.length === 0) {
          alert("Nincs aktív terméked, amit felajánlhatnál.");

          navigate("/items");

          return;
        }

        setMyItems(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );
      }
    };

    fetchItems();
  }, [token, navigate]);

  const handleSubmit = async () => {
    if (!token) {
      return;
    }

    if (!itemId) {
      alert("A termék nem található");
      navigate("/");

      return;
    }

    if (!selectedItemId) {
      alert("Válassz egy terméket!");

      return;
    }

    try {
      await createOffer(token, Number(itemId), [Number(selectedItemId)]);

      alert("Ajánlat elküldve.");

      navigate("/offers");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Az ajánlatot nem sikerült elküldeni.",
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>Ajánlat küldése</h1>

      <p>Válassz egy saját terméket, amit felajánlasz cserére.</p>

      <select
        className={styles.select}
        value={selectedItemId}
        onChange={(event) => setSelectedItemId(event.target.value)}
      >
        <option value="">Válassz terméket</option>

        {myItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>

      <button className={styles.button} onClick={handleSubmit}>
        Ajánlat küldése
      </button>
    </div>
  );
}

export default CreateOffer;
