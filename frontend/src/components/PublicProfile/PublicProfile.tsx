import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { PublicUserProfile } from "../../types/PublicUserProfile";

import { getPublicProfile } from "../../api/userApi";

import styles from "./PublicProfile.module.css";
import { API_URL } from "../../api/apiConfig";

function PublicProfile() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        const data = await getPublicProfile(Number(id));

        setProfile(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a profilt.",
        );

        navigate("/");
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (!profile) {
    return <p>Betöltés...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatar}>
          {profile.avatar ? (
            <img
              src={`${API_URL}/uploads/${profile.avatar}`}
              alt={profile.username}
            />
          ) : (
            "👤"
          )}
        </div>

        <h1>{profile.username}</h1>

        <p>
          <strong>Város:</strong> {profile.city}
        </p>

        <p>
          <strong>Bemutatkozás:</strong>
        </p>

        <p>{profile.bio || "Nincs bemutatkozás."}</p>

        <p>
          <strong>Érdeklődési körök:</strong>
        </p>

        {profile.interests.length > 0 ? (
          <ul>
            {profile.interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        ) : (
          <p>Nincsenek érdeklődési körök.</p>
        )}

        <p>
          <strong>Regisztrált:</strong>{" "}
          {new Date(profile.created_at).toLocaleDateString("hu-HU")} óta
        </p>

        <Link className={styles.button} to={`/users/${profile.id}/items`}>
          Termékei megtekintése
        </Link>
      </div>
    </div>
  );
}

export default PublicProfile;
