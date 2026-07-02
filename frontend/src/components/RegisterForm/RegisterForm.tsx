import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

import { allInterests } from "../../utils/interests";

import styles from "./RegisterForm.module.css";

function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");

  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim() || !city.trim()) {
      alert("Tölts ki minden kötelező mezőt!");
      return;
    }

    if (password.length < 8) {
      alert("A jelszónak legalább 8 karakterből kell állnia.");

      return;
    }

    try {
      await registerUser(
        username.trim(),
        email.trim(),
        password,
        city.trim(),
        bio.trim(),
        selectedInterests,
      );

      alert("Sikeres regisztráció!");

      navigate("/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Sikertelen regisztráció.",
      );
    }
  };

  return (
    <form className={`formCard ${styles.form}`} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Regisztráció</h1>

      <input
        className="input"
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <input
        className="input"
        type="email"
        placeholder="Email"
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

      <input
        className="input"
        type="text"
        placeholder="Város"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <textarea
        className="textarea"
        placeholder="Bemutatkozás"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
      />
      <h3 className={styles.subtitle}>Érdeklődési körök</h3>

      <div className={styles.checkboxGroup}>
        {allInterests.map((interest) => (
          <label key={interest} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={selectedInterests.includes(interest)}
              onChange={() => handleInterestToggle(interest)}
            />
            {interest}
          </label>
        ))}
      </div>
      <button className="button buttonPrimary" type="submit">
        Regisztráció
      </button>
    </form>
  );
}

export default RegisterForm;
