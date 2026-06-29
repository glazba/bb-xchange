import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import { getReceivedOffers, updateOfferStatus } from "../../api/tradeOfferApi";

import type { TradeOffer } from "../../types/TradeOffer";
import { offerStatusLabels } from "../../utils/itemLabels";

import styles from "./ReceivedOffers.module.css";

function ReceivedOffers() {
  const { token } = useAuth();

  const [offers, setOffers] = useState<TradeOffer[]>([]);

  const fetchOffers = async () => {
    if (!token) {
      return;
    }

    const data = await getReceivedOffers(token);

    setOffers(data);
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    const loadOffers = async () => {
      const data = await getReceivedOffers(token);
      setOffers(data);
    };

    loadOffers();
  }, [token]);

  const handleAccept = async (offerId: number) => {
    if (!token) {
      return;
    }
    await updateOfferStatus(token, offerId, "accepted");

    await fetchOffers();
  };

  const handleReject = async (offerId: number) => {
    if (!token) {
      return;
    }
    await updateOfferStatus(token, offerId, "rejected");
    await fetchOffers();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Beérkezett ajánlatok</h1>

      {offers.length === 0 && <p>Még nem kaptál ajánlatot.</p>}

      {offers.map((offer) => (
        <div key={offer.id} className={styles.card}>
          <h3>Ajánlat # {offer.id}</h3>

          <div className={styles.info}>
            <p>
              <strong>Státusz:</strong> {offerStatusLabels[offer.status]}
            </p>
            <p>
              <strong>Kért termék:</strong> {offer.target_item_id}
            </p>
            <p>
              <strong>Létrehozva:</strong>{" "}
              {new Date(offer.created_at).toLocaleDateString("hu-HU")}
            </p>
          </div>

          {offer.status === "pending" && (
            <div className={styles.buttons}>
              <button
                className={styles.acceptButton}
                onClick={() => handleAccept(offer.id)}
              >
                Elfogadom
              </button>
              <button
                className={styles.rejectButton}
                onClick={() => handleReject(offer.id)}
              >
                Elutasítom
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReceivedOffers;
