import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import NotificationBell from "../NotificationBell/NotificationBell";
import MessageBell from "../MessageBell/MessageBell";

import styles from "./Navbar.module.css";

function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="../../public/bb_xchange_logo.png" alt="BB-XChange" />
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

            <MessageBell />

            <NotificationBell />

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
