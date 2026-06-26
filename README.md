# B-B Xchange

A full-stack web application for exchanging books and board games.

## Technologies

### Backend

- Node.js
- Express.js
- TypeScript
- MySQL
- JWT Authentication
- bcrypt
- Helmet
- Express Rate Limit
- CORS

### Frontend

- React
- TypeScript
- CSS

---

## Features

### Authentication

- Register
- Login
- JWT Authentication

### Items

- Create item
- Update item
- Delete item
- View own items
- View all items

### Books

- Add book details
- View book details

### Board Games

- Add board game details
- View board game details

### Trade Offers

- Create offers
- View sent offers
- View received offers
- Accept or reject offers
- Offer multiple items in one trade

---

## Installation

```bash
git clone <repository-url>

cd bb-xchange

npm install
```

Create a `.env` file:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bb_xchange
JWT_SECRET=your_secret_key
```

Run the project:

```bash
npm run dev
```

---

## API Endpoints

### Authentication

POST /users/register

POST /users/login

### Items

GET /items

GET /items/:id

POST /items

PUT /items/:id

DELETE /items/:id

### Trade Offers

POST /offers

GET /offers/me

GET /offers/received

PUT /offers/:id
