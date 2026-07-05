import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../api/authApi";

import { allInterests } from "../../utils/interests";

import styles from "./RegisterForm.module.css";
import toast from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";

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
      toast("Tölts ki minden kötelező mezőt!");
      return;
    }

    if (password.length < 8) {
      toast("A jelszónak legalább 8 karakterből kell állnia.");
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

      toast.success("Sikeres regisztráció!");

      navigate("/login");
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  return (
    <form className={`formCard ${styles.form}`} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h1 className={styles.title}>Csatlakozz a közösséghez!</h1>

        <p className={styles.subtitle}>
          Hozd létre a profilodat, és kezdj el könyveket és társasjátékokat
          cserélni.
        </p>
      </header>

      <div className={styles.fields}>
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

        <input
          className="input"
          type="text"
          placeholder="Város"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />

        <textarea
          className="textarea"
          placeholder="Bemutatkozás (nem kötelező)"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </div>

      <section className={styles.interestsSection}>
        <h3 className={styles.sectionTitle}>Érdeklődési körök</h3>

        <p className={styles.sectionDescription}>
          Válaszd ki, mi érdekel leginkább.
        </p>

        <div className="checkboxGroup">
          {allInterests.map((interest) => (
            <label key={interest} className="checkbox">
              <input
                type="checkbox"
                checked={selectedInterests.includes(interest)}
                onChange={() => handleInterestToggle(interest)}
              />

              {interest}
            </label>
          ))}
        </div>
      </section>

      <button className={`button buttonPrimary ${styles.button}`} type="submit">
        Regisztráció
      </button>
    </form>
  );
}

export default RegisterForm;
