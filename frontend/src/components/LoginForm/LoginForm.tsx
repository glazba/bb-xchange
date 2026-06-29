import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

import styles from "./LoginForm.module.css";

function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Add meg az email címet és a jelszót!");
      return;
    }

    try {
      const data = await loginUser(email.trim(), password);

      login(data.token);

      alert("Sikeres bejelentkezés!");

      navigate("/");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Sikertelen bejelentkezés.",
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Bejelentkezés</h1>

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

      <button className={styles.button} type="submit">
        Bejelentkezés
      </button>
    </form>
  );
}

export default LoginForm;
