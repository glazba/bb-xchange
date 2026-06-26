import { useState } from "react";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = await loginUser(email, password);

    console.log(data);

    if (data.token) {
      login(data.token);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Bejelentkezés</h1>

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

      <button type="submit">Bejelentkezés</button>
    </form>
  );
}

export default LoginForm;
