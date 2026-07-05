import { Link } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import NotificationBell from "../NotificationBell/NotificationBell";
import MessageBell from "../MessageBell/MessageBell";

import styles from "./Navbar.module.css";

function Navbar() {
  const { token, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <img src="/bb_xchange_logo.png" alt="BB-XChange" />
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Menü megnyitása"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`${styles.links} ${isMenuOpen ? styles.open : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          {!token ? (
            <>
              <Link to="/login" onClick={closeMenu}>
                Bejelentkezés
              </Link>

              <Link to="/register" onClick={closeMenu}>
                Regisztráció
              </Link>
            </>
          ) : (
            <>
              <Link to="/marketplace" onClick={closeMenu}>
                Marketplace
              </Link>

              <Link to="/items" onClick={closeMenu}>
                Termékeim
              </Link>

              <Link to="/offers" onClick={closeMenu}>
                Ajánlataim
              </Link>

              <Link to="/offers/received" onClick={closeMenu}>
                Beérkező ajánlatok
              </Link>

              <div className={styles.icons}>
                <MessageBell />
                <NotificationBell />
              </div>

              <Link to="/profile" onClick={closeMenu}>
                Profil
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className={`button buttonDanger ${styles.logoutButton}`}
              >
                Kijelentkezés
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
