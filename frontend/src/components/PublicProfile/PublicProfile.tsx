import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { PublicUserProfile } from "../../types/PublicUserProfile";

import { getPublicProfile } from "../../api/userApi";

import styles from "./PublicProfile.module.css";
import { API_URL } from "../../api/apiConfig";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { handleApiError } from "../../utils/handleApiError";

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
        handleApiError(error, navigate);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (!profile) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={`panel ${styles.card}`}>
        <header className={styles.header}>
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

          <h1 className={styles.title}>{profile.username}</h1>

          <p className={styles.memberSince}>
            Tag: {new Date(profile.created_at).toLocaleDateString("hu-HU")}
          </p>
        </header>

        <section className={styles.info}>
          <div className={styles.infoCard}>
            <strong>Város</strong>
            <span>{profile.city || "-"}</span>
          </div>

          <div className={styles.bioBox}>
            <h3>Bemutatkozás</h3>

            <p className={styles.bio}>{profile.bio || "Nincs bemutatkozás."}</p>
          </div>

          <div className={styles.interestsBox}>
            <h3>Érdeklődési körök</h3>

            {profile.interests.length > 0 ? (
              <div className={styles.tags}>
                {profile.interests.map((interest) => (
                  <span key={interest} className={styles.tag}>
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p>Nincsenek érdeklődési körök.</p>
            )}
          </div>

          <Link
            className={`button buttonPrimary ${styles.itemsButton}`}
            to={`/users/${profile.id}/items`}
          >
            📚 {profile.username} termékei
          </Link>
        </section>
      </div>
    </div>
  );
}

export default PublicProfile;
