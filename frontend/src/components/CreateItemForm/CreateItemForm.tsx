import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { createItem } from "../../api/itemApi";

import styles from "./CreateItemForm.module.css";

function CreateItemForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemCondition, setItemCondition] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (!type || !title.trim() || !itemCondition) {
      alert("Tölts ki minden mezőt!");
      return;
    }

    try {
      await createItem(token, type, title, description, itemCondition);

      navigate("/my-items");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "A terméket nem sikerült létrehozni.",
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Termék hozzáadása</h1>

      <select
        className={styles.input}
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="">Típus</option>
        <option value="book">Könyv</option>
        <option value="boardgame">Társasjáték</option>
      </select>

      <input
        className={styles.input}
        type="text"
        placeholder="Cím"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        className={styles.input}
        type="text"
        placeholder="Leírás"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <select
        className={styles.input}
        value={itemCondition}
        onChange={(event) => setItemCondition(event.target.value)}
      >
        <option value="">Állapot</option>
        <option value="new">Új</option>
        <option value="excellent">Kitűnő</option>
        <option value="good">Jó</option>
        <option value="used">Használt</option>
        <option value="damaged">Sérült</option>
      </select>

      <button className={styles.button}>Hozzáadás</button>
    </form>
  );
}

export default CreateItemForm;
