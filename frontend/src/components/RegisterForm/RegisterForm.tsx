import { useState } from "react";
import { registerUser } from "../../api/authApi";

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
    <form onSubmit={handleSubmit}>
      <h1>Regisztráció</h1>

      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Jelszó"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <input
        type="text"
        placeholder="Város"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <button type="submit">Regisztráció</button>
    </form>
  );
}

export default RegisterForm;
