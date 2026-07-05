import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Item } from "../../types/Item";
import { getAllItems } from "../../api/itemApi";

import ItemCard from "../ItemCard/ItemCard";

import styles from "./Home.module.css";
import toast from "react-hot-toast";

function Home() {
  const [latestItems, setLatestItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItems();

        const latest = data
          .filter((item: Item) => item.status === "active")
          .sort(
            (a, b) =>
              new Date(b.created_at ?? "").getTime() -
              new Date(a.created_at ?? "").getTime(),
          )
          .slice(0, 5);

        setLatestItems(latest);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );
      }
    };

    fetchItems();
  }, []);

  return (
    <div className={`page ${styles.page}`}>
      <section className={styles.hero}>
        <img
          className={styles.logo}
          src="/bb_xchange_logo.png"
          alt="BB-XChange"
        />

        <h1 className={styles.title}>Cserélj könyveket és társasjátékokat</h1>

        <p className={styles.subtitle}>
          Egyszerűen, biztonságosan és teljesen ingyen. Találd meg a következő
          kedvenc könyvedet vagy társasjátékodat a közösség segítségével.
        </p>

        <div className={styles.heroButtons}>
          <Link className="button buttonPrimary" to="/marketplace">
            Marketplace
          </Link>

          <Link className="button buttonSecondary" to="/items">
            Saját termékeim
          </Link>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2>Hogyan működik?</h2>

        <div className={styles.steps}>
          <article className={`panel ${styles.step}`}>
            <h3>1.</h3>
            <p>Tölts fel egy könyvet vagy társasjátékot.</p>
          </article>

          <article className={`panel ${styles.step}`}>
            <h3>2.</h3>
            <p>Böngéssz mások termékei között.</p>
          </article>

          <article className={`panel ${styles.step}`}>
            <h3>3.</h3>
            <p>Küldj csereajánlatot és cseréljetek.</p>
          </article>
        </div>
      </section>

      <section className={styles.latest}>
        <h2>Legfrissebb termékek</h2>

        {latestItems.length === 0 ? (
          <p className={styles.empty}>Még nincsenek feltöltött termékek.</p>
        ) : (
          <div className="grid">
            {latestItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <Link className={styles.marketplaceLink} to="/marketplace">
          Összes termék megtekintése →
        </Link>
      </section>
    </div>
  );
}

export default Home;
