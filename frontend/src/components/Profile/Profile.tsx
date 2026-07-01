import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
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
        alert(
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
      alert("Válassz ki egy képet!");

      return;
    }

    try {
      await uploadAvatar(token, selectedAvatar);

      const updatedProfile = await getProfile(token);

      setProfile(updatedProfile);

      setSelectedAvatar(null);

      alert("Profilkép sikeresen feltöltve.");
    } catch (error) {
      alert(
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

      alert("Profil sikeresen frissítve.");
    } catch (error) {
      alert(
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
      alert("Add meg a jelszavad!");
      return;
    }

    const confirmed = window.confirm(
      "Biztosan törölni szeretnéd a profilodat? Ez a művelet nem vonható vissza.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProfile(token, deletePassword);

      alert("A profil sikeresen törölve.");

      logout();

      navigate("/");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "A profil törlése sikertelen.",
      );
    }
  };

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
              alt="Profilkép"
              className={styles.avatarImage}
            />
          ) : (
            "👤"
          )}
        </div>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={(event) =>
            setSelectedAvatar(event.target.files?.[0] ?? null)
          }
        />

        <label htmlFor="avatar-upload" className={styles.uploadButton}>
          📷 Profilkép kiválasztása
        </label>

        {selectedAvatar && (
          <p className={styles.fileName}>{selectedAvatar.name}</p>
        )}

        {selectedAvatar && (
          <button className={styles.button} onClick={handleAvatarUpload}>
            Feltöltés
          </button>
        )}

        <h1>{profile.username}</h1>

        {!isEditing ? (
          <div className={styles.info}>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>

            <p>
              <strong>Város:</strong> {profile.city}
            </p>

            <p>
              <strong>Bemutatkozás:</strong>
            </p>

            <p className={styles.bio}>{profile.bio || "Nincs bemutatkozás."}</p>

            <p>
              <strong>Érdeklődési körök:</strong>
            </p>

            {profile.interests.length > 0 ? (
              <ul className={styles.interests}>
                {profile.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            ) : (
              <p>Még nem adtál meg érdeklődési köröket.</p>
            )}

            <p>
              <strong>Regisztráció:</strong>{" "}
              {new Date(profile.created_at).toLocaleDateString("hu-HU")}
            </p>

            <p>
              <strong>Utolsó módosítás:</strong>{" "}
              {new Date(profile.updated_at).toLocaleDateString("hu-HU")}
            </p>
          </div>
        ) : (
          <div className={styles.editForm}>
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Felhasználónév"
            />

            <input
              className={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Város"
            />

            <textarea
              className={styles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bemutatkozás"
            />

            <h3>Érdeklődési körök</h3>

            <div className={styles.checkboxGroup}>
              {allInterests.map((interest) => (
                <label key={interest} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />

                  {interest}
                </label>
              ))}
            </div>

            <button className={styles.button} onClick={handleSave}>
              Mentés
            </button>
          </div>
        )}

        <button
          className={styles.button}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Mégse" : "Profil szerkesztése"}
        </button>

        {/* delete */}
        {!isEditing && (
          <>
            <hr />

            <h3>Fiók törlése</h3>

            <input
              className={styles.input}
              type="password"
              placeholder="Jelszó"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
            />

            <button
              className={styles.deleteButton}
              onClick={handleDeleteProfile}
            >
              Fiók törlése
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
