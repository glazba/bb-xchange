import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { createItem, uploadItemImages } from "../../api/itemApi";

import { itemConditionLabels } from "../../utils/itemLabels";

import { bookGenres, boardgameGenres } from "../../utils/itemGenres";

import styles from "./CreateItemForm.module.css";

function CreateItemForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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

  const conditions: [string, string][] = Object.entries(itemConditionLabels);

  const genres =
    type === "book" ? bookGenres : type === "boardgame" ? boardgameGenres : [];

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 5) {
      alert("Maximum 5 kép tölthető fel.");
      return;
    }

    setSelectedImages(files);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (!type || !title.trim() || !itemCondition) {
      alert("Tölts ki minden kötelező mezőt!");
      return;
    }

    try {
      const result = await createItem(token, {
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

      if (selectedImages.length > 0) {
        await uploadItemImages(token, result.itemId, selectedImages);
      }

      alert("Termék sikeresen létrehozva.");

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

        {conditions.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
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

          <select
            className={styles.input}
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            <option value="">Műfaj</option>

            {genres.map((itemGenre) => (
              <option key={itemGenre} value={itemGenre}>
                {itemGenre}
              </option>
            ))}
          </select>

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
          <select
            className={styles.input}
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            <option value="">Műfaj</option>

            {genres.map((itemGenre) => (
              <option key={itemGenre} value={itemGenre}>
                {itemGenre}
              </option>
            ))}
          </select>

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

      <h3>Termék képei</h3>

      <input
        id="item-images"
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={handleImagesChange}
      />

      <label htmlFor="item-images" className={styles.uploadButton}>
        📷 Képek kiválasztása
      </label>

      {selectedImages.length > 0 && (
        <ul className={styles.imageList}>
          {selectedImages.map((image) => (
            <li key={image.name}>{image.name}</li>
          ))}
        </ul>
      )}

      <p>{selectedImages.length} / 5 kép kiválasztva</p>

      <button className={styles.button}>Hozzáadás</button>
    </form>
  );
}

export default CreateItemForm;
