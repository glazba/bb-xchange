import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

import { getMyOffers, revokeOffer } from "../../api/tradeOfferApi";
import type { TradeOffer } from "../../types/TradeOffer";

import { offerStatusLabels } from "../../utils/itemLabels";

import styles from "./Offers.module.css";

function Offers() {
  const { token } = useAuth();

  const [offers, setOffers] = useState<TradeOffer[]>([]);

  const fetchOffers = async () => {
    if (!token) {
      return;
    }

    try {
      const data = await getMyOffers(token);

      setOffers(data);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nem sikerült betölteni az ajánlatokat.",
      );

      setOffers([]);
    }
  };

  useEffect(() => {
    const loadOffers = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getMyOffers(token);
        setOffers(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni az ajánlatokat.",
        );
        setOffers([]);
      }
    };

    loadOffers();
  }, [token]);

  const handleRevoke = async (offerId: number) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      "Biztosan vissza szeretnéd vonni az ajánlatot?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await revokeOffer(token, offerId);

      await fetchOffers();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nem sikerült visszavonni az ajánlatot.",
      );
    }
  };

  return (
    <div className={`page ${styles.container}`}>
      <h1 className={styles.title}>Elküldött ajánlataim</h1>

      {offers.length === 0 && <p>Még nem küldtél csereajánlatot.</p>}

      {offers.map((offer) => (
        <div
          key={offer.id}
          className={`panel ${styles.card} ${styles[offer.status]}`}
        >
          <h3>Csereajánlat</h3>

          <div className={styles.info}>
            <p>
              <strong>Kért termék:</strong>{" "}
              {offer.target_title ?? offer.target_item_id}
            </p>

            <p>
              <strong>Tulajdonos:</strong>{" "}
              {offer.owner_id ? (
                <Link to={`/users/${offer.owner_id}`}>{offer.owner_name}</Link>
              ) : (
                (offer.owner_name ?? "Ismeretlen.")
              )}
            </p>

            <p>
              <strong>Felajánlott termék(ek):</strong>
            </p>

            <ul className={styles.itemList}>
              {offer.offered_items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <p>
              <strong>Státusz:</strong> {offerStatusLabels[offer.status]}
            </p>

            <p>
              <strong>Létrehozva:</strong>{" "}
              {new Date(offer.created_at).toLocaleDateString("hu-HU")}
            </p>

            {offer.status === "pending" && (
              <button
                className={`button buttonSecondary ${styles.revokeButton}`}
                onClick={() => handleRevoke(offer.id)}
              >
                Ajánlat visszavonása
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Offers;
