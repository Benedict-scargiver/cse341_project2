const mongodb = require("../database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db("csewk1-2").collection("books").find();
    result.toArray().then((books) => {
      res.status(200).json(books);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const book = await mongodb.getDatabase().db("csewk1-2").collection("books").findOne({ _id: bookId });
    if (!book) return res.status(404).json({ error: "Not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("books").insertOne({ title, author, year });
    res.status(201).json({ message: "Book created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("books").replaceOne(
      { _id: bookId },
      { title, author, year }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("books").deleteOne({ _id: bookId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook,
};