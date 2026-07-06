import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

import styles from "./LoginForm.module.css";
import toast from "react-hot-toast";

function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast("Add meg az email címet és a jelszót!");
      return;
    }

    try {
      const data = await loginUser(email.trim().toLowerCase(), password);

      login(data.token);

      toast.success("Sikeres bejelentkezés!");

      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Sikertelen bejelentkezés.",
      );
    }
  };

  return (
    <form className={`formCard ${styles.form}`} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h1 className={styles.title}>Üdv újra!</h1>

        <p className={styles.subtitle}>Jelentkezz be, és folytasd a cserét.</p>
      </header>

      <div className={styles.fields}>
        <input
          className="input"
          type="email"
          placeholder="Email cím"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button className={`button buttonPrimary ${styles.button}`} type="submit">
        Bejelentkezés
      </button>
    </form>
  );
}

export default LoginForm;
