[README.md](https://github.com/user-attachments/files/23359527/README.md)
# Full Stack Project

This project consists of two parts:
- **Frontend** – Built with [Vite + React](https://vitejs.dev/)
- **Backend** – Built with [Node.js + Express](https://expressjs.com/)

Both are contained within this repository:
```
project/
│
├── frontend/
└── backend/
```

---

## 🛠️ Prerequisites

Before starting, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node)
- [Git](https://git-scm.com/)

---

## ⚙️ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The backend will start on your defined `PORT` (e.g., http://localhost:5000).

---

## 💻 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory and add the following environment variable:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

   > Update this value based on your backend’s running URL in production.

4. Run the frontend development server:
   ```bash
   npm run dev
   ```

   The app will be available on a local port (usually http://localhost:5173).

---

## 🧩 Folder Structure

```
project/
│
├── frontend/        # React + Vite frontend
│   ├── src/
│   ├── public/
    ├── pages/
    ├── components/
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
└── backend/         # Node.js + Express backend
    ├── src/ or routes/
    ├── models/
    ├── routes/
    ├── app.js
    ├── package.json
    └── .env
```

---

## 🚀 Deployment Notes

- Always set the environment variables (`.env`) properly before deployment.
- In production, the backend’s URL should be the deployed API endpoint.
- The frontend can be built using:
  ```bash
  npm run build
  ```
  which will generate a `dist/` folder ready for deployment.

---

## 🧾 License

This project is open source and available under the [MIT License](LICENSE).
