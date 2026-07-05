import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { createItem, uploadItemImages } from "../../api/itemApi";

import { itemConditionLabels } from "../../utils/itemLabels";

import { bookGenres, boardgameGenres } from "../../utils/itemGenres";

import styles from "./CreateItemForm.module.css";
import toast from "react-hot-toast";

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
      toast("Maximum 5 kép tölthető fel.");
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
      toast("Tölts ki minden kötelező mezőt!");
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

      toast.success("Termék sikeresen létrehozva.");

      navigate("/items");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "A terméket nem sikerült létrehozni.",
      );
    }
  };

  return (
    <form className={`formCard ${styles.form}`} onSubmit={handleSubmit}>
      <header className={styles.header}>
        <h1 className={styles.title}>Új termék hozzáadása</h1>

        <p className={styles.subtitle}>
          Töltsd fel a könyvedet vagy társasjátékodat, és találd meg a tökéletes
          cserét.
        </p>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Alapadatok</h3>

        <div className={styles.fields}>
          <input
            className="input"
            type="text"
            placeholder="Cím"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            className="textarea"
            placeholder="Leírás"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <select
            className="input"
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
            className="input"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">Típus</option>
            <option value="book">Könyv</option>
            <option value="boardgame">Társasjáték</option>
          </select>
        </div>
      </section>

      {type === "book" && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Könyv adatai</h3>

          <div className={styles.fields}>
            <input
              className="input"
              type="text"
              placeholder="Szerző"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />

            <select
              className="input"
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
              className="input"
              type="number"
              placeholder="Oldalszám"
              value={pageCount}
              onChange={(event) => setPageCount(event.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Kiadás éve"
              value={publishedYear}
              onChange={(event) => setPublishedYear(event.target.value)}
            />

            <input
              className="input"
              type="text"
              placeholder="ISBN szám"
              value={isbn}
              onChange={(event) => setIsbn(event.target.value)}
            />
          </div>
        </section>
      )}

      {type === "boardgame" && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Társasjáték adatai</h3>

          <div className={styles.fields}>
            <select
              className="input"
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
              className="input"
              type="number"
              placeholder="Minimum játékos"
              value={minPlayers}
              onChange={(event) => setMinPlayers(event.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Maximum játékos"
              value={maxPlayers}
              onChange={(event) => setMaxPlayers(event.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Ajánlott életkor"
              value={recommendedAge}
              onChange={(event) => setRecommendedAge(event.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Játékidő percben"
              value={playTime}
              onChange={(event) => setPlayTime(event.target.value)}
            />
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Termék képei</h3>

        <input
          id="item-images"
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={handleImagesChange}
        />

        <label
          htmlFor="item-images"
          className={`button buttonSecondary ${styles.uploadButton}`}
        >
          📷 Képek kiválasztása
        </label>

        {selectedImages.length > 0 && (
          <ul className={styles.imageList}>
            {selectedImages.map((image) => (
              <li key={image.name}>{image.name}</li>
            ))}
          </ul>
        )}

        <p className={styles.counter}>
          {selectedImages.length} / 5 kép kiválasztva
        </p>
      </section>

      <button className={`button buttonPrimary ${styles.submitButton}`}>
        Hozzáadás
      </button>
    </form>
  );
}

export default CreateItemForm;
