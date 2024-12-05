import express from "express";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase-config.js";
import { Todo } from "./todo-schema.js";
import bodyParser from "body-parser";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const app = express();
const port = parseInt(process.env.PORT) || 8080;
console.log(port);

const checkIfLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ").at(-1);

  // console.log("User token:", token);

  // Validasi token

  const tokenIsValid = token !== undefined;

  if (tokenIsValid) {
    next();
  } else {
    res.status(401).send("Unauthorized: Please log in first.");
  }
};

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const todosCollection = collection(db, "todos");

// Arrow Function
app.post("/todos", checkIfLoggedIn, async (req, res) => {
  try {
    const todo = new Todo(
      req.body.author,
      req.body.description,
      req.body.title,
    );

    await addDoc(todosCollection, JSON.parse(JSON.stringify(todo)));

    res.send("Document has been saved!");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// Route untuk mendapatkan semua todos
app.get("/todos", async (req, res) => {
  try {
    const todosCollectionRef = todosCollection;
    const todosSnapshot = await getDocs(todosCollectionRef);
    const todos = todosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil data todos");
  }
});

// /todos/4zs57ZVKFUOa4RdMhQXK
app.put("/todos/:todoId", async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const description = req.body.description;
    const title = req.body.title;

    const docToUpdate = doc(todosCollection, todoId);

    await updateDoc(docToUpdate, {
      description: description,
      title,
    });

    res.send("Document has been updated!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil data todos");
  }
});

app.delete("/todos/:todoId", async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const docToDelete = doc(todosCollection, todoId);

    await deleteDoc(docToDelete);

    res.send("Document has been deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat menghapus data todos");
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    await createUserWithEmailAndPassword(auth, email, password);

    res.send("Register success!");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const result = await signInWithEmailAndPassword(auth, email, password);

    console.log(result.user);

    res.send(JSON.parse(JSON.stringify(result.user)));
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
