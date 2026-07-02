import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        BB-XChange
      </Link>

      <div className={styles.links}>
        <Link to="/">Home</Link>

        {!token && (
          <>
            <Link to="/login">Bejelentkezés</Link>
            <Link to="/register">Regisztráció</Link>
          </>
        )}

        {token && (
          <>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/items">Termékeim</Link>
            <Link to="/offers">Ajánlataim</Link>
            <Link to="/offers/received">Beérkező ajánlatok</Link>
            <Link to="/profile">Profil</Link>

            <button
              type="button"
              onClick={logout}
              className={`button buttonDanger ${styles.logoutButton}`}
            >
              Kijelentkezés
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
