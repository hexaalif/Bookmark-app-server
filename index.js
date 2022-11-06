const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccmxqkh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const booksCollection = client.db("sm_soft").collection("books");

    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = booksCollection.find(query);
      const books = await cursor.toArray();
      res.send(books);
    });

    app.get("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const books = await booksCollection.findOne(query);
      res.send(books);
    });

    app.post("/books", async (req, res) => {
      const newBooks = req.body;
      const result = await booksCollection.insertOne(newBooks);
      res.send(result);
    });

    // Update bookmark
    app.put("/books/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const updateBooks = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedBookmarks = {
        $set: {
          title: updateBooks.title,
          tags: updateBooks.tags,
          link: updateBooks.link,
        },
      };
      const result = await booksCollection.updateOne(
        filter,
        updatedBookmarks,
        options
      );
      res.send(result);
    });

    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await booksCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from sm soft solutions");
});

app.listen(port, () => {
  console.log(`sm soft app listening on port ${port}`);
});
