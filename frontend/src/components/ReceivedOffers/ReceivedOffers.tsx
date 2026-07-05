import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

import { getReceivedOffers, updateOfferStatus } from "../../api/tradeOfferApi";

import type { TradeOffer } from "../../types/TradeOffer";
import { offerStatusLabels } from "../../utils/itemLabels";

import styles from "./ReceivedOffers.module.css";
import toast from "react-hot-toast";
import EmptyState from "../EmptyState/EmptyState";

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
      toast.error(
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
        toast.error(
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

      toast.success("Az ajánlat elfogadva.");

      await fetchOffers();
    } catch (error) {
      toast.error(
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

      toast.success("Az ajánlat elutasítva.");

      await fetchOffers();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nem sikerült elutasítani az ajánlatot.",
      );
    }
  };

  return (
    <div className={`page ${styles.container}`}>
      <header className={styles.header}>
        <h1>Beérkezett ajánlatok</h1>

        <p className={styles.subtitle}>
          Kezeld a más felhasználóktól kapott csereajánlatokat.
        </p>
      </header>

      {offers.length === 0 ? (
        <EmptyState
          icon="📥"
          title="Még nem kaptál csereajánlatot"
          description="Ha valaki érdeklődik valamelyik terméked iránt, itt fogod látni a beérkező ajánlatokat."
        />
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
                  <strong>Kért termék:</strong> {offer.target_title}
                </p>

                <p>
                  <strong>Ajánlatot tette:</strong>{" "}
                  {offer.requester_id ? (
                    <Link to={`/users/${offer.requester_id}`}>
                      {offer.requester_name}
                    </Link>
                  ) : (
                    (offer.requester_name ?? "Ismeretlen")
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
                  to={`/messages/${offer.requester_id}`}
                >
                  Beszélgetés
                </Link>

                {offer.status === "pending" && (
                  <>
                    <button
                      className="button buttonSuccess"
                      onClick={() => handleAccept(offer.id)}
                    >
                      Elfogadom
                    </button>

                    <button
                      className="button buttonDanger"
                      onClick={() => handleReject(offer.id)}
                    >
                      Elutasítom
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReceivedOffers;
