import styles from "./Profile.module.css";

function Profile() {
  const user = {
    username: "Felhasználó",
    email: " email@example.com",
    city: "Budapest",
    bio: "Még nincs bemutatkozás.",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatar}>👤</div>
        <h1>{user.username}</h1>

        <div className={styles.info}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Város:</strong> {user.city}
          </p>
          <p>
            <strong>Bemutatkozás:</strong>
          </p>
          <p className={styles.bio}>{user.bio}</p>
        </div>

        <button className={styles.button}>Profil szerkesztése</button>
      </div>
    </div>
  );
}

export default Profile;
