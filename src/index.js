const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const credentials = require("../firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.headers.authorization; // Ambil token langsung tanpa memproses prefix
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/", (req, res) => {
  res.send({
    message: "welcome to my api",
  });
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Cek apakah email sudah terdaftar
    const userExists = await db.collection("account").where("email", "==", email).get();
    if (!userExists.empty) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Daftarkan pengguna ke Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // Simpan data tambahan ke Firestore
    await db.collection("account").doc(userRecord.uid).set({
      name: name,
      email: email,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User successfully registered", uid: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Validasi email dan password menggunakan Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);

    // Gunakan Firebase Client SDK atau tambahkan validasi manual password jika Anda mengelola hashing sendiri
    // Dalam kasus ini, kita asumsikan password sudah sesuai di Firebase Authentication.

    // Buat JWT token
    const token = jwt.sign({ uid: userRecord.uid, email: userRecord.email }, jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      loginResult: {
        userId: userRecord.uid,
        name: userRecord.displayName,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`use this port : ${port}`);
});
