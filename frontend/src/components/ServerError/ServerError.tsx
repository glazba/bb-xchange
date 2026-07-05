import { Link } from "react-router-dom";

import styles from "./ServerError.module.css";

function ServerError() {
  return (
    <div className={styles.container}>
      <div className={`panel ${styles.card}`}>
        <h1>500</h1>
        <h2>Valami hiba történt</h2>
        <p>
          Úgy tűnik, valami elromlott a BB-XChange szerverein. Próbáld újra
          később.
        </p>

        <Link className="button buttonPrimary" to="/">
          Vissza a főoldalra
        </Link>
      </div>
    </div>
  );
}

export default ServerError;
