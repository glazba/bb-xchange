import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>BB-XChange</h2>

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
            <Link to="/create-item">Termék hozzáadása</Link>
            <Link to="/offers">Ajánlatok</Link>
            <Link to="/profile">Profil</Link>
            <button
              type="button"
              onClick={logout}
              className={styles.logoutButton}
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
