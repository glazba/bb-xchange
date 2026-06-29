import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getMyOffers } from "../../api/tradeOfferApi";
import type { TradeOffer } from "../../types/TradeOffer";

import styles from "./Offers.module.css";
import { offerStatusLabels } from "../../utils/itemLabels";

function Offers() {
  const { token } = useAuth();

  const [offers, setOffers] = useState<TradeOffer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!token) {
        return;
      }

      const data = await getMyOffers(token);
      console.log(data);

      setOffers(data);
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
              <strong>Státusz:</strong> {offerStatusLabels[offer.status]}
            </p>
            <p>
              <strong>Kért termék:</strong>{" "}
              {offer.target_title ?? offer.target_item_id}
            </p>
            <p>
              <strong>Tulajdonos:</strong> {offer.owner_name ?? "Ismeretlen"}
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
