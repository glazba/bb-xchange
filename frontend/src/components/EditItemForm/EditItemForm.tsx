import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { getItemById, updateItem } from "../../api/itemApi";

import styles from "./EditItemForm.module.css";

function EditItemForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams();

  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemCondition, setItemCondition] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !id) {
      return;
    }

    await updateItem(token, id, type, title, description, itemCondition);

    navigate("/items");
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        return;
      }

      const item = await getItemById(id);

      setType(item.type);
      setTitle(item.title);
      setDescription(item.description);
      setItemCondition(item.item_condition);
    };

    fetchItem();
  }, [id]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Termék módosítása</h1>

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

      <button className={styles.button}>Mentés</button>
    </form>
  );
}

export default EditItemForm;
