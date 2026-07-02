import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import {
  getItemById,
  updateItem,
  uploadItemImages,
  deleteItemImage,
  setItemCoverImage,
} from "../../api/itemApi";

import type { ItemImage } from "../../types/ItemImage";

import { itemConditionLabels } from "../../utils/itemLabels";
import { bookGenres, boardgameGenres } from "../../utils/itemGenres";

import styles from "./EditItemForm.module.css";
import { API_URL } from "../../api/apiConfig";

function EditItemForm() {
  const { token } = useAuth();

  const navigate = useNavigate();

  const { id } = useParams();

  const [itemImages, setItemImages] = useState<ItemImage[]>([]);
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

  const itemData = {
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
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (itemImages.length + files.length > 5) {
      alert("Maximum 5 kép tölthető fel.");

      return;
    }

    setSelectedImages(files);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm("Biztosan törölni szeretnéd ezt a képet?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteItemImage(token, imageId);

      setItemImages((prev) => prev.filter((image) => image.id !== imageId));

      alert("Kép sikeresen törölve.");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "A kép törlése sikertelen.",
      );
    }
  };

  const handleSetCover = async (imageId: number) => {
    if (!token) {
      return;
    }

    try {
      await setItemCoverImage(token, imageId);

      setItemImages((prev) =>
        prev.map((image) => ({
          ...image,
          is_cover: image.id === imageId,
        })),
      );

      alert("Borítókép módosítva.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "A borítókép módosítása sikertelen.",
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (!id) {
      alert("A termék nem található.");
      navigate("/items");
      return;
    }

    if (!type || !title.trim() || !description.trim() || !itemCondition) {
      alert("Tölts ki minden mezőt!");
      return;
    }

    try {
      await updateItem(token, id, itemData);

      if (selectedImages.length > 0) {
        await uploadItemImages(token, Number(id), selectedImages);
      }

      alert("Termék sikeresen módosítva.");

      navigate("/items");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "A terméket nem sikerült módosítani.",
      );
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        return;
      }

      try {
        const item = await getItemById(id);

        setItemImages(item.images ?? []);

        setType(item.type);
        setTitle(item.title);
        setDescription(item.description);
        setItemCondition(item.item_condition);

        setAuthor(item.author ?? "");
        setGenre(item.genre ?? "");
        setPageCount(item.page_count ? String(item.page_count) : "");
        setPublishedYear(
          item.published_year ? String(item.published_year) : "",
        );
        setIsbn(item.isbn ?? "");

        setMinPlayers(item.min_players ? String(item.min_players) : "");
        setMaxPlayers(item.max_players ? String(item.max_players) : "");
        setRecommendedAge(
          item.recommended_age ? String(item.recommended_age) : "",
        );
        setPlayTime(item.playtime ? String(item.playtime) : "");
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a terméket.",
        );

        navigate("/items");
      }
    };
    fetchItem();
  }, [id, navigate]);

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Termék módosítása</h1>

      <div className={styles.imageGallery}>
        {itemImages.map((image) => (
          <div key={image.id} className={styles.imageCard}>
            <img src={`${API_URL}/uploads/${image.image_url}`} alt={title} />

            {image.is_cover ? (
              <p className={styles.coverBadge}>⭐ Borítókép</p>
            ) : (
              <button
                type="button"
                className={styles.coverButton}
                onClick={() => handleSetCover(image.id)}
              >
                Legyen borítókép
              </button>
            )}

            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => handleDeleteImage(image.id)}
            >
              Törlés
            </button>
          </div>
        ))}
      </div>

      <input
        id="item-images"
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={handleImagesChange}
      />

      <label htmlFor="item-images" className={styles.uploadButton}>
        📷 Képek hozzáadása
      </label>

      {selectedImages.length > 0 && (
        <ul className={styles.imageList}>
          {selectedImages.map((image) => (
            <li key={image.name}>{image.name}</li>
          ))}
        </ul>
      )}

      <p>{itemImages.length + selectedImages.length} / 5 kép</p>

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
        onChange={(event) => {
          setType(event.target.value);
          setGenre("");
        }}
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

      <button className={styles.button}>Mentés</button>
    </form>
  );
}

export default EditItemForm;
