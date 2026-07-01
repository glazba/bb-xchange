import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import type { Item } from "../../types/Item";

import { getAllItems, getMyItems } from "../../api/itemApi";

import { bookGenres, boardgameGenres } from "../../utils/itemGenres";

import ItemCard from "../ItemCard/ItemCard";

import styles from "./Marketplace.module.css";

function Marketplace() {
  const { token } = useAuth();

  const [items, setItems] = useState<Item[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const [pageFilter, setPageFilter] = useState("");

  const [playersFilter, setPlayersFilter] = useState("");

  const [ageFilter, setAgeFilter] = useState("");

  const genres =
    typeFilter === "book"
      ? bookGenres
      : typeFilter === "boardgame"
        ? boardgameGenres
        : [];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const allItems = await getAllItems();

        if (!token) {
          setItems(allItems);
          return;
        }

        const myItems = await getMyItems(token);

        const marketplaceItems = allItems.filter(
          (item) => !myItems.some((myItem) => myItem.id === item.id),
        );

        setItems(marketplaceItems);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a termékeket.",
        );
      }
    };

    fetchItems();
  }, [token]);

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);

    setGenreFilter("");
    setPageFilter("");
    setPlayersFilter("");
    setAgeFilter("");
  };

  const filteredItems = items.filter((item) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      searchText === "" ||
      item.title.toLowerCase().includes(searchText) ||
      item.author?.toLowerCase().includes(searchText);

    const matchesType = typeFilter === "" || item.type === typeFilter;

    const matchesGenre = genreFilter === "" || item.genre === genreFilter;

    const matchesPages =
      pageFilter === "" ||
      (item.page_count !== null &&
        item.page_count !== undefined &&
        item.page_count >= Number(pageFilter));

    const matchesPlayers =
      playersFilter === "" ||
      (item.min_players !== null &&
        item.max_players !== null &&
        item.min_players !== undefined &&
        item.max_players !== undefined &&
        Number(playersFilter) >= item.min_players &&
        Number(playersFilter) <= item.max_players);

    const matchesAge =
      ageFilter === "" ||
      (item.recommended_age !== null &&
        item.recommended_age !== undefined &&
        item.recommended_age <= Number(ageFilter));

    return (
      matchesSearch &&
      matchesType &&
      matchesGenre &&
      matchesPages &&
      matchesPlayers &&
      matchesAge
    );
  });

  return (
    <div className={styles.page}>
      <h1>Marketplace</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Keresés cím vagy szerző alapján..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(event) => handleTypeChange(event.target.value)}
        >
          <option value="">Minden típus</option>

          <option value="book">Könyv</option>

          <option value="boardgame">Társasjáték</option>
        </select>

        {typeFilter === "book" && (
          <>
            <select
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
            >
              <option value="">Minden műfaj</option>

              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Minimum oldalszám"
              value={pageFilter}
              onChange={(event) => setPageFilter(event.target.value)}
            />
          </>
        )}

        {typeFilter === "boardgame" && (
          <>
            <select
              value={genreFilter}
              onChange={(event) => setGenreFilter(event.target.value)}
            >
              <option value="">Minden műfaj</option>

              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Játékosok száma"
              value={playersFilter}
              onChange={(event) => setPlayersFilter(event.target.value)}
            />

            <input
              type="number"
              placeholder="Ajánlott életkor"
              value={ageFilter}
              onChange={(event) => setAgeFilter(event.target.value)}
            />
          </>
        )}
      </div>

      {filteredItems.length === 0 && (
        <p className={styles.empty}>Nincs találat a megadott szűrőkre.</p>
      )}

      <div className={styles.grid}>
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={() => {}}
            isOwner={false}
          />
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
