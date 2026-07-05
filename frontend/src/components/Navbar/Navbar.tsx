import { Link, NavLink } from "react-router-dom";
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
          <img loading="lazy" src="/bb_xchange_logo.png" alt="BB-XChange" />
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
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? styles.activeLink : undefined
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          {!token ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Bejelentkezés
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Regisztráció
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Marketplace
              </NavLink>

              <NavLink
                to="/items"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Termékeim
              </NavLink>

              <NavLink
                to="/offers"
                end
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Ajánlataim
              </NavLink>

              <NavLink
                to="/offers/received"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Beérkező ajánlatok
              </NavLink>

              <div className={styles.icons}>
                <MessageBell />
                <NotificationBell />
              </div>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : undefined
                }
                onClick={closeMenu}
              >
                Profil
              </NavLink>

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
