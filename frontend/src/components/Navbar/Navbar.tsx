import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>BB-XChange</h2>

      <div className={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/items">My Items</Link>
        <Link to="/offers">Offers</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
