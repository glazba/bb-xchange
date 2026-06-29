import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getMyOffers } from "../../api/tradeOfferApi";
import type { TradeOffer } from "../../types/TradeOffer";

import { offerStatusLabels } from "../../utils/itemLabels";

import styles from "./Offers.module.css";

function Offers() {
  const { token } = useAuth();

  const [offers, setOffers] = useState<TradeOffer[]>([]);

  useEffect(() => {
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

    fetchOffers();
  }, [token]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Elküldött ajánlataim</h1>

      {offers.length === 0 && <p>Még nincs elküldött ajánlatod.</p>}

      {offers.map((offer) => (
        <div key={offer.id} className={styles.card}>
          <h3>Ajánlat # {offer.id}</h3>

          <div className={styles.info}>
            <p>
              <strong>Kért termék:</strong>{" "}
              {offer.target_title ?? offer.target_item_id}
            </p>
            <p>
              <strong>Tulajdonos:</strong> {offer.owner_name ?? "Ismeretlen"}
            </p>
            <p>
              <strong>Státusz:</strong> {offerStatusLabels[offer.status]}
            </p>
            <p>
              <strong>Létrehozva:</strong>{" "}
              {new Date(offer.created_at).toLocaleDateString("hu-HU")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Offers;
