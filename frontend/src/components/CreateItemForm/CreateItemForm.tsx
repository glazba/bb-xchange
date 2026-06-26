import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { createItem } from "../../api/itemApi";

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

    await createItem(token, type, title, description, itemCondition);

    navigate("/items");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Termék hozzáadása</h1>

      <select value={type} onChange={(event) => setType(event.target.value)}>
        <option value="">Típus</option>
        <option value="book">Könyv</option>
        <option value="boardgame">Társasjáték</option>
      </select>

      <input
        type="text"
        placeholder="Cím"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        type="text"
        placeholder="Leírás"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <select
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
      <button type="submit">Hozzáadás</button>
    </form>
  );
}

export default CreateItemForm;
