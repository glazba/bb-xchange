# 📚🎲 BB-XChange

BB-XChange is a full-stack web application where users can exchange books and board games with each other. Users can upload their own items with (max 5) photos, browse the marketplace, send trade offers, chat with other users, and complete exchanges safely.

---

# 🌐 Live Demo

**Frontend:**  
`Coming soon`

**Backend API:**  
`Coming soon`

---

# 🔑 Demo Account

You can test the application using the following account:

**Email:** `peter@test.hu`  
**Password:** `Password123!`

---

# 📸 Screenshots

## Registration

![Registration](./screenshots/registration.png)

---

## Login

![Login](./screenshots/login.png)

---

## Home Page

![Home Page](./screenshots/homepage.png)
![Home Page](./screenshots/homepage_2.png)
![Home Page](./screenshots/homepage_3.png)

---

## My Items

![My Items](./screenshots/add_item.png)
![My Items](./screenshots/add_book.png)
![My Items](./screenshots/add_boardgame.png)
![My Items](./screenshots/edit_item.png)

---

## Marketplace

![Marketplace](./screenshots/marketplace.png)

---

## Item Details

![Item Details](./screenshots/item_details.png)

---

## Create Offer

![Create Offer](./screenshots/offer_create.png)

---

## Offers

![Offers](./screenshots/offers.png)

---

## Received Offers

![Received Offers](./screenshots/received_offers.png)

---

## Messages

![Messages](./screenshots/messages.png)

---

## Notifications

![Notifications](./screenshots/notifications.png)

---

## Profile

![Profile](./screenshots/profile.png)
![Profile](./screenshots/edit_profile.png)

---

## Public Profile

![Public Profile](./screenshots/public_profile.png)

---

## Public Profile Items

![Public Profile](./screenshots/public_profile_items.png)

---

# ✨ Features

## 🔐 Authentication

- User registration
- Login with JWT authentication
- Password hashing with bcrypt
- Protected routes
- Persistent login session

---

## 👤 User Profiles

- Edit profile information
- Upload profile picture
- Add interests
- Public profile pages
- Delete account

---

## 📚🎲 Item Management

### Books

- Author
- Genre
- Page count
- Published year
- ISBN

### Board Games

- Genre
- Minimum players
- Maximum players
- Recommended age
- Playtime

### General Features

- Create items
- Edit items
- Delete items
- Upload multiple images
- Select cover image
- Item status management

---

# 🛒 Marketplace

- Browse all active items
- Search by title
- Filter by:

### General Filters

- Item type
- Item condition

### Book Filters

- Author
- Genre

### Board Game Filters

- Genre
- Player count
- Recommended age

---

# 🖼️ Image Gallery

- Multiple images per item
- Thumbnail gallery
- Fullscreen lightbox
- Keyboard navigation

### Supported shortcuts

- ← Previous image
- → Next image
- ESC Close lightbox

---

# 🤝 Trade Offers

Users can:

- Send trade offers
- Offer multiple items
- Revoke pending offers
- Accept offers
- Reject offers
- Cancel accepted offers
- Complete trades

---

## Item Statuses

- `active`
- `reserved`
- `traded`

---

## Offer Statuses

- `pending`
- `accepted`
- `completed`
- `rejected`
- `cancelled`
- `revoked`

---

# 💬 Messaging System

- Private conversations between traders
- Unread message counter
- Send message with Enter
- New line with Shift + Enter
- Conversation history

---

# 🔔 Notification System

Notifications for:

- New offer
- Offer accepted
- Offer rejected
- Offer completed
- New message

Additional features:

- Unread notification counter
- Relative timestamps

Examples:

- 5 minutes ago
- 2 hours ago
- 3 days ago

---

# 🌍 Public Profiles

Each user has a public profile page containing:

- Username
- Profile picture
- City
- Bio
- Interests
- Active items

---

# 🏗️ Tech Stack

## Frontend

- React
- TypeScript
- React Router
- CSS Modules
- React Hot Toast
- Vite

---

## Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Multer
- bcryptjs

---

## Database

- MySQL

---

# 🗄️ Database Structure

```text
users
interests
user_interests
items
item_images
book_details
boardgame_details
trade_offers
offer_items
messages
notifications
```

---

# 📁 Project Structure

```text
bb-xchange/
│
├── frontend/
├── backend/
├── README.md
└── screenshots/
```

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
CLIENT_URL=
```

## Frontend

```env
VITE_API_URL=
```

---

# 🚀 Installation

## Clone repository

```bash
git clone https://github.com/glazba/bb-xchange.git
cd bb-xchange
```

---

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🧪 Test Data

The project includes:

- `schema.sql`
- `seed.sql`

These files can be used to create and populate the database.

---

# 📦 Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
```

---

# 🔮 Future Improvements

- Email verification
- Password reset
- Real-time chat with WebSockets
- Push notifications
- Favorites system
- User ratings and reviews
- Admin dashboard

---

# 👨‍💻 Author

**Tamás Szabados**

Portfolio Project – 2026
