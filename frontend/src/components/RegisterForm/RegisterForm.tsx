import { useState } from "react";
import { registerUser } from "../../api/authApi";
import styles from "./RegisterForm.module.css";

function RegisterForm() {
  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [city, setCity] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = await registerUser(username, email, password, city);

    console.log(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Regisztráció</h1>

      <input
        className={styles.input}
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        className={styles.input}
        type="password"
        placeholder="Jelszó"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Város"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <button className={styles.button} type="submit">
        Regisztráció
      </button>
    </form>
  );
}

export default RegisterForm;
