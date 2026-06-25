# Private Chat Application (MEAN Stack)

This is a simple real-time private chat application built using the **MEAN stack** (MongoDB, Express, Angular/Node.js) and **Socket.io**. The primary goal of this project is to practice and demonstrate core Node.js concepts, including routing, unit testing, password encryption, token-based authentication, and real-time communication.

## 🚀 Key Features

* **Real-time Communication:** Instant messaging powered by Socket.io.
* **Token-based Authentication:** Secure user sessions using JSON Web Tokens (JWT).
* **Password Encryption:** Secure password hashing and decryption with Bcryptjs.
* **Unit Testing:** Robust backend testing using Mocha and Chai frameworks.
* **Database Integration:** Chat history and user information securely stored in MongoDB.

## 🛠️ Tech Stack & Dependencies

* **Backend:** [Node.js](https://nodejs.org) & [Express](https://expressjs.com) (Server setup and routing)
* **Real-time Engine:** [Socket.io](https://socket.io) (Bi-directional communication)
* **Database:** [MongoDB](https://mongodb.com) (Data storage via `mongojs`)
* **Security:** `bcryptjs` (Password encryption) & `jsonwebtoken` (JWT implementation)
* **Testing:** `mocha` & `chai` (Unit testing)
* **Frontend:** HTML, JavaScript (AngularJS/MEAN structure)

## 📁 Project Structure

```text
├── api/                # API controllers (login, registration, etc.)
├── config.js           # Configuration settings (DB links, secret keys)
├── node_modules/       # Node.js dependencies
├── public/             # Frontend assets (HTML, CSS, client-side JS)
├── routes.js           # Express application routing
├── server.js           # Main application entry point
├── socketchat.js       # Socket.io event handling logic
├── test/               # Mocha & Chai unit tests
├── package.json        # Project metadata and dependencies
└── Procfile            # Deployment configuration (e.g., for Heroku)
```

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed:
* [Node.js](https://nodejs.org) (v12+ recommended)
* [MongoDB](https://mongodb.com) (Local instance running or a MongoDB Atlas URI)

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd private-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Environment:**
   Open `config.js` and update your MongoDB connection string and JWT secret keys if necessary.

4. **Start the server:**
   ```bash
   npm start
   ```
   *Alternatively, run `node server.js`.*

5. **Access the app:**
   Open your browser and navigate to `http://localhost:3000` (or the port specified in your `server.js`).

## 🧪 Running Tests

To run the automated unit tests written with Mocha and Chai, execute:
```bash
npm test
```


