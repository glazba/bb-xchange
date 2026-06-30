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

    try {
      const data = await getReceivedOffers(token);

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
        const data = await getReceivedOffers(token);

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

  const handleAccept = async (offerId: number) => {
    if (!token) {
      return;
    }

    try {
      await updateOfferStatus(token, offerId, "accepted");

      alert("Az ajánlat elfogadva.");

      await fetchOffers();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nem sikerült elfogadni az ajánlatot.",
      );
    }
  };

  const handleReject = async (offerId: number) => {
    if (!token) {
      return;
    }

    try {
      await updateOfferStatus(token, offerId, "rejected");

      alert("Az ajánlat elutasítva.");

      await fetchOffers();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Nem sikerült elutasítani az ajánlatot.",
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Beérkezett ajánlatok</h1>

      {offers.length === 0 && <p>Még nem kaptál ajánlatot.</p>}

      {offers.map((offer) => (
        <div
          key={offer.id}
          className={`${styles.card} ${styles[offer.status]}`}
        >
          <h3>Csereajánlat</h3>

          <div className={styles.info}>
            <p>
              <strong>Kért termék:</strong> {offer.target_title}
            </p>

            <p>
              <strong>Ajánlatot tette:</strong> {offer.requester_name}
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
