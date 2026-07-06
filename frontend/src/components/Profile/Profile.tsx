import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteProfile,
} from "../../api/userApi";

import { allInterests } from "../../utils/interests";

import type { UserProfile } from "../../types/UserProfile";

import styles from "./Profile.module.css";
import { API_URL } from "../../api/apiConfig";

function Profile() {
  const { token, logout } = useAuth();

  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const [username, setUsername] = useState("");

  const [city, setCity] = useState("");

  const [bio, setBio] = useState("");

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getProfile(token);

        setProfile(data);

        setUsername(data.username);
        setCity(data.city ?? "");
        setBio(data.bio ?? "");
        setSelectedInterests(data.interests);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Nem sikerült betölteni a profilt.",
        );
      }
    };

    fetchProfile();
  }, [token]);

  const handleAvatarUpload = async () => {
    if (!token) {
      return;
    }

    if (!selectedAvatar) {
      toast("Válassz ki egy képet!");

      return;
    }

    try {
      await uploadAvatar(token, selectedAvatar);

      const updatedProfile = await getProfile(token);

      setProfile(updatedProfile);

      setSelectedAvatar(null);

      toast.success("Profilkép sikeresen feltöltve.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "A profilkép feltöltése sikertelen.",
      );
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest],
    );
  };

  const handleSave = async () => {
    if (!token) {
      return;
    }

    try {
      const data = await updateProfile(
        token,
        username,
        city,
        bio,
        selectedInterests,
      );

      setProfile(data);

      setIsEditing(false);

      toast.success("Profil sikeresen frissítve.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "A profil módosítása sikertelen.",
      );
    }
  };

  const handleDeleteProfile = async () => {
    if (!token) {
      return;
    }

    if (!deletePassword) {
      toast("Add meg a jelszavad!");
      return;
    }

    const confirmed = window.confirm(
      "Biztosan törölni szeretnéd a profilodat? Ez a művelet nem vonható vissza.",
    );

    if (!confirmed) {
      setDeletePassword("");
      return;
    }

    try {
      await deleteProfile(token, deletePassword);

      toast.success("A profil sikeresen törölve.");

      logout();

      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "A profil törlése sikertelen.",
      );
    }
  };

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
                loading="lazy"
                src={`${API_URL}/uploads/${profile.avatar}`}
                alt="Profilkép"
                className={styles.avatarImage}
              />
            ) : (
              "👤"
            )}
          </div>

          <h1>{profile.username}</h1>

          <p className={styles.memberSince}>
            Tag: {new Date(profile.created_at).toLocaleDateString("hu-HU")}
          </p>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={(event) =>
              setSelectedAvatar(event.target.files?.[0] ?? null)
            }
          />

          <label
            htmlFor="avatar-upload"
            className={`button buttonPrimary ${styles.uploadButton}`}
          >
            📷 Profilkép kiválasztása
          </label>

          {selectedAvatar && (
            <>
              <p className={styles.fileName}>{selectedAvatar.name}</p>

              <button
                className={`button buttonPrimary ${styles.avatarButton}`}
                onClick={handleAvatarUpload}
              >
                Feltöltés
              </button>
            </>
          )}
        </header>

        {!isEditing ? (
          <section className={styles.info}>
            <div className={styles.infoCard}>
              <strong>Email</strong>
              <span>{profile.email}</span>
            </div>

            <div className={styles.infoCard}>
              <strong>Város</strong>
              <span>{profile.city}</span>
            </div>

            <div className={styles.bioBox}>
              <h3>Bemutatkozás</h3>

              <p className={styles.bio}>
                {profile.bio || "Nincs bemutatkozás."}
              </p>
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
                <p>Még nem adtál meg érdeklődési köröket.</p>
              )}
            </div>

            <div className={styles.infoCard}>
              <strong>Utolsó módosítás</strong>

              <span>
                {new Date(profile.updated_at).toLocaleDateString("hu-HU")}
              </span>
            </div>
          </section>
        ) : (
          <section className={styles.editForm}>
            <input
              className="input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Felhasználónév"
            />

            <input
              className="input"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Város"
            />

            <textarea
              className="textarea"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Bemutatkozás"
            />

            <h3>Érdeklődési körök</h3>

            <div className="checkboxGroup">
              {allInterests.map((interest) => (
                <label key={interest} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />

                  {interest}
                </label>
              ))}
            </div>

            <button
              className={`button buttonSuccess ${styles.button}`}
              onClick={handleSave}
            >
              Mentés
            </button>
          </section>
        )}

        <button
          className={`button buttonPrimary ${styles.button}`}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Mégse" : "Profil szerkesztése"}
        </button>

        {!isEditing && (
          <section className={styles.dangerZone}>
            <h3>Fiók törlése</h3>

            <p>Ez a művelet nem vonható vissza.</p>

            <input
              className="input"
              type="password"
              placeholder="Jelszó"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
            />

            <button
              className={`button buttonDanger ${styles.deleteButton}`}
              onClick={handleDeleteProfile}
            >
              Fiók törlése
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default Profile;
