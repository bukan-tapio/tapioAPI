import express from "express";
import bodyParser from "body-parser";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { TODO } from "./schema-API.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// code program
app.get("/", (req, res) => {
  res.send("halo dunia");
});

//asycn. metode yang digunakan jika memerlukan waktu proses
const data_collection = collection(db, "users"); // todo adalah nama tabel
app.post("/todos", async (req, res) => {
  try {
    // manggil class
    const todo = new TODO(req.body.author, req.body.desc, req.body.title);
    console.log(req.body); //menampilkan versi yang tidak diterima firebase

    //merubah object agar bisa diterima firebase
    const docRef = await addDoc(data_collection, JSON.parse(JSON.stringify(todo)));
    console.log(docRef); //menampilkan versi yang diterima firebase

    res.send("documentaion has ben saved!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const data_collection_ref = data_collection;
    const querySnapshot = await getDocs(data_collection_ref);
    const todo = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(todo);
  } catch (e) {
    console.error("Error getting document: ", e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
