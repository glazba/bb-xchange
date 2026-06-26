import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { token, login, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>BB-XChange</h2>

      <div className={styles.links}>
        <Link to="/">Home</Link>
        <button onClick={() => login("test-token")}>Login Test</button>
        <button onClick={logout}>Logout Test</button>
        <span>{token ? "Logged in" : "Logged out"}</span>
        <Link to="/items">My Items</Link>
        <Link to="/offers">Offers</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
