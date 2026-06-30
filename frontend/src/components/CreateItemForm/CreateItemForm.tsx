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

  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [isbn, setIsbn] = useState("");

  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [recommendedAge, setRecommendedAge] = useState("");
  const [playTime, setPlayTime] = useState("");

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
      await createItem(token, {
        type,
        title,
        description,
        item_condition: itemCondition,

        author: author || undefined,
        genre: genre || undefined,
        page_count: pageCount ? Number(pageCount) : undefined,
        published_year: publishedYear ? Number(publishedYear) : undefined,
        isbn: isbn || undefined,

        min_players: minPlayers ? Number(minPlayers) : undefined,
        max_players: maxPlayers ? Number(maxPlayers) : undefined,
        recommended_age: recommendedAge ? Number(recommendedAge) : undefined,
        playtime: playTime ? Number(playTime) : undefined,
      });

      navigate("/items");
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

      <select
        className={styles.input}
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="">Típus</option>
        <option value="book">Könyv</option>
        <option value="boardgame">Társasjáték</option>
      </select>

      {type === "book" && (
        <>
          <input
            className={styles.input}
            type="text"
            placeholder="Szerző"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Műfaj"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Oldalszám"
            value={pageCount}
            onChange={(event) => setPageCount(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Kiadás éve"
            value={publishedYear}
            onChange={(event) => setPublishedYear(event.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="ISBN szám"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
          />
        </>
      )}

      {type === "boardgame" && (
        <>
          <input
            className={styles.input}
            type="text"
            placeholder="Műfaj"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Minimum játékos"
            value={minPlayers}
            onChange={(event) => setMinPlayers(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Maximum játékos"
            value={maxPlayers}
            onChange={(event) => setMaxPlayers(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Ajánlott életkor"
            value={recommendedAge}
            onChange={(event) => setRecommendedAge(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            placeholder="Játékidő percben"
            value={playTime}
            onChange={(event) => setPlayTime(event.target.value)}
          />
        </>
      )}

      <button className={styles.button}>Hozzáadás</button>
    </form>
  );
}

export default CreateItemForm;
