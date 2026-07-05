import { Link } from "react-router-dom";

import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={`panel ${styles.card}`}>
        <h1>404 😵</h1>
        <h2>Az oldal nem található</h2>

        <p>Úgy tűnik, hogy a keresett terméked már lekerült a polcról.</p>

        <Link className="button buttonPrimary" to="/">
          Vissza a főoldalra
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
