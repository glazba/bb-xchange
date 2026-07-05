import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

import type { Item } from "../../types/Item";

import { getAllItems, getMyItems } from "../../api/itemApi";

import { bookGenres, boardgameGenres } from "../../utils/itemGenres";

import ItemCard from "../ItemCard/ItemCard";

import styles from "./Marketplace.module.css";
import { itemConditionLabels } from "../../utils/itemLabels";

function Marketplace() {
  const { token } = useAuth();

  const [items, setItems] = useState<Item[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  const [pageFilter, setPageFilter] = useState("");

  const [playersFilter, setPlayersFilter] = useState("");

  const [ageFilter, setAgeFilter] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  const genres =
    typeFilter === "book"
      ? bookGenres
      : typeFilter === "boardgame"
        ? boardgameGenres
        : [];

  const conditions: [string, string][] = Object.entries(itemConditionLabels);

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

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setConditionFilter("");
    setGenreFilter("");
    setPageFilter("");
    setPlayersFilter("");
    setAgeFilter("");
    setSortBy("newest");
  };

  const filteredItems = items
    .filter((item) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        searchText === "" ||
        item.title.toLowerCase().includes(searchText) ||
        item.author?.toLowerCase().includes(searchText);

      const matchesType = typeFilter === "" || item.type === typeFilter;

      const matchesCondition =
        conditionFilter === "" || item.item_condition === conditionFilter;

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
        matchesCondition &&
        matchesGenre &&
        matchesPages &&
        matchesPlayers &&
        matchesAge
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "oldest":
          return (
            new Date(a.created_at ?? "").getTime() -
            new Date(b.created_at ?? "").getTime()
          );

        case "newest":
        default:
          return (
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime()
          );
      }
    });

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <h1>Marketplace</h1>

        <p className={styles.subtitle}>
          Böngéssz a közösség könyvei és társasjátékai között.
        </p>
      </header>

      <section className={`panel ${styles.filters}`}>
        <div className={styles.filtersGrid}>
          <input
            className="input"
            type="text"
            placeholder="Keresés cím vagy szerző alapján..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="input"
            value={typeFilter}
            onChange={(event) => handleTypeChange(event.target.value)}
          >
            <option value="">Minden típus</option>

            <option value="book">Könyv</option>

            <option value="boardgame">Társasjáték</option>
          </select>

          <select
            className="input"
            value={conditionFilter}
            onChange={(event) => setConditionFilter(event.target.value)}
          >
            <option value="">Minden állapot</option>

            {conditions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Legújabb elöl</option>

            <option value="oldest">Legrégebbi elöl</option>

            <option value="title-asc">Cím (A-Z)</option>

            <option value="title-desc">Cím (Z-A)</option>
          </select>

          {typeFilter === "book" && (
            <>
              <select
                className="input"
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
                className="input"
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
                className="input"
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
                className="input"
                type="number"
                placeholder="Játékosok száma"
                value={playersFilter}
                onChange={(event) => setPlayersFilter(event.target.value)}
              />

              <input
                className="input"
                type="number"
                placeholder="Ajánlott életkor"
                value={ageFilter}
                onChange={(event) => setAgeFilter(event.target.value)}
              />
            </>
          )}
        </div>

        <div className={styles.filterFooter}>
          <p className={styles.resultCount}>{filteredItems.length} találat</p>

          <button className="button buttonPrimary" onClick={handleResetFilters}>
            Szűrők törlése
          </button>
        </div>
      </section>

      {filteredItems.length === 0 ? (
        <div className={styles.empty}>
          <h3>Nincs találat</h3>

          <p>Próbálj meg más szűrőket használni.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;
