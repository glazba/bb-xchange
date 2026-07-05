# BB-XChange

A modern web application for exchanging books and board games with other collectors and hobby enthusiasts.

---

# 🇭🇺 Magyar

## 📖 Projektről

A **BB-XChange** egy teljes értékű csereplatform, amely lehetővé teszi a felhasználók számára, hogy:

- könyveket és társasjátékokat töltsenek fel,
- más felhasználók termékei között böngésszenek,
- csereajánlatokat küldjenek,
- üzeneteket váltsanak,
- értesítéseket kapjanak,
- valamint véglegesítsék vagy megszakítsák a cserefolyamatot.

A projekt elsődleges célja egy modern, reszponzív és valós üzleti logikát megvalósító portfólió alkalmazás létrehozása.

---

# ✨ Funkciók

## Felhasználók

- Regisztráció
- Bejelentkezés JWT autentikációval
- Profil szerkesztése
- Profilkép feltöltése
- Nyilvános profiloldal
- Érdeklődési körök megadása

---

## Termékek

- Könyvek és társasjátékok feltöltése
- Több kép kezelése
- Borítókép kiválasztása
- Termék szerkesztése
- Termék törlése
- Saját termékek listázása
- Nyilvános terméklista

---

## Marketplace

- Teljes terméklista
- Keresés
- Szűrés:

  - típus szerint
  - állapot szerint
  - könyv szerzője szerint
  - műfaj szerint
  - játékosok száma szerint

- Reszponzív megjelenés

---

## Csereajánlatok

- Ajánlat küldése
- Ajánlat visszavonása
- Ajánlat elfogadása
- Ajánlat elutasítása
- Csere véglegesítése
- Csere meghiúsulásának kezelése

---

## Üzenetek

- Privát beszélgetések
- Beszélgetéslista
- Olvasatlan üzenetek jelzése
- Automatikus frissítés

---

## Értesítések

- Új ajánlat
- Elfogadott ajánlat
- Elutasított ajánlat
- Sikeres csere
- Új üzenet

---

# 🔄 Cserefolyamat

```text
Ajánlat elküldése
        ↓
      Pending
        ↓
     Elfogadva
        ↓
 ┌───────────────┐
 ↓               ↓
Lezárva      Meghiúsult
 ↓               ↓
Traded        Active
```

---

# 🛠️ Technológiák

## Frontend

- React 19
- TypeScript
- React Router
- CSS Modules
- React Hot Toast

## Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Multer
- bcryptjs

## Adatbázis

- MySQL
- MySQL2

---

# 📁 Projekt struktúra

```text
frontend/
backend/
├── sql/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
```

---

# 🚀 Telepítés

## 1. Repository klónozása

```bash
git clone https://github.com/your-username/bb-xchange.git
```

## 2. Backend

```bash
cd backend
npm install
```

## 3. Frontend

```bash
cd frontend
npm install
```

---

# 🗄️ Adatbázis létrehozása

Futtasd:

```sql
schema.sql
```

Opcionálisan:

```sql
seed.sql
```

> A seed fájl csak üres adatbázison használható.

---

# ⚙️ Környezeti változók

## Backend (.env)

```env
PORT=5000

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
```

## Frontend (.env)

```env
VITE_API_URL=
```

---

# 📷 Képernyőképek

## Home

![Home](screenshots/home.png)

## Marketplace

![Marketplace](screenshots/marketplace.png)

## Item Details

![Item Details](screenshots/item-details.png)

## Offers

![Offers](screenshots/offers.png)

## Messages

![Messages](screenshots/messages.png)

---

# 📌 Jövőbeli fejlesztések

- E-mail értesítések
- PWA támogatás
- Admin felület
- Valós idejű chat WebSockettel
- Felhasználói értékelési rendszer

---

# 🇬🇧 English

## 📖 About

**BB-XChange** is a modern marketplace application that allows users to exchange books and board games with each other.

The project focuses on implementing real-world business logic with a modern and responsive user experience.

---

# ✨ Features

## Users

- Registration
- Login with JWT authentication
- Profile editing
- Avatar upload
- Public profiles
- Interests

---

## Items

- Add books and board games
- Multiple images
- Cover image selection
- Edit items
- Delete items
- Public item pages

---

## Marketplace

- Search
- Filtering
- Responsive layout

---

## Trade Offers

- Create offers
- Revoke offers
- Accept offers
- Reject offers
- Complete trades
- Handle failed trades

---

## Messaging

- Private conversations
- Conversation list
- Unread messages
- Automatic refresh

---

## Notifications

- New offers
- Accepted offers
- Rejected offers
- Completed trades
- New messages

---

# 🔄 Trade Flow

```text
Create Offer
      ↓
    Pending
      ↓
   Accepted
      ↓
 ┌───────────────┐
 ↓               ↓
Completed      Cancelled
 ↓               ↓
Traded         Active
```

---

# 🛠️ Tech Stack

## Frontend

- React 19
- TypeScript
- React Router
- CSS Modules
- React Hot Toast

## Backend

- Node.js
- Express.js
- TypeScript
- Express
- JWT
- Multer
- bcryptjs

## Database

- MySQL
- MySQL2

---

# 🚀 Installation

## Clone repository

```bash
git clone https://github.com/your-username/bb-xchange.git
```

## Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd frontend
npm install
```

---

# 🗄️ Database

Run:

```sql
schema.sql
```

Optionally:

```sql
seed.sql
```

> The seed file should only be used on a fresh database.

---

# ⚙️ Environment Variables

## Backend

```env
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

## Frontend

```env
VITE_API_URL=
```

---

# 📷 Screenshots

Add screenshots here.

---

# 🚧 Future Improvements

- Email notifications
- PWA support
- Admin panel
- Real-time chat with WebSockets
- User ratings and reviews

---

# 👨‍💻 Author

**Tamás Szabados**

Full Stack Developer Portfolio Project