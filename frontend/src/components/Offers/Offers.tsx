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
      <header className={styles.header}>
        <h1>Elküldött ajánlataim</h1>

        <p className={styles.subtitle}>
          Kövesd nyomon a folyamatban lévő és lezárt csereajánlataidat.
        </p>
      </header>

      {offers.length === 0 ? (
        <div className={styles.empty}>
          <h3>Még nem küldtél ajánlatot</h3>

          <p>
            Böngéssz a Marketplace-en, és küldj csereajánlatot más
            felhasználóknak.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`panel ${styles.card} ${styles[offer.status]}`}
            >
              <div className={styles.cardHeader}>
                <h3>Csereajánlat</h3>

                <span className={styles.statusBadge}>
                  {offerStatusLabels[offer.status]}
                </span>
              </div>

              <div className={styles.info}>
                <p>
                  <strong>Kért termék:</strong>{" "}
                  {offer.target_title ?? offer.target_item_id}
                </p>

                <p>
                  <strong>Tulajdonos:</strong>{" "}
                  {offer.owner_id ? (
                    <Link to={`/users/${offer.owner_id}`}>
                      {offer.owner_name}
                    </Link>
                  ) : (
                    (offer.owner_name ?? "Ismeretlen")
                  )}
                </p>

                <div>
                  <strong>Felajánlott termékek:</strong>

                  <ul className={styles.itemList}>
                    {offer.offered_items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <p>
                  <strong>Létrehozva:</strong>{" "}
                  {new Date(offer.created_at).toLocaleDateString("hu-HU")}
                </p>
              </div>

              <div className={styles.actions}>
                <Link
                  className="button buttonPrimary"
                  to={`/messages/${offer.owner_id}`}
                >
                  Beszélgetés
                </Link>

                {offer.status === "pending" && (
                  <button
                    className="button buttonSecondary"
                    onClick={() => handleRevoke(offer.id)}
                  >
                    Ajánlat visszavonása
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Offers;
