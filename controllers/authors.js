const mongodb = require("../database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db("csewk1-2").collection("authors").find();
    result.toArray().then((authors) => {
      res.status(200).json(authors);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const author = await mongodb.getDatabase().db("csewk1-2").collection("authors").findOne({ _id: authorId });
    if (!author) return res.status(404).json({ error: "Not found" });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("authors").insertOne({ name, bio });
    res.status(201).json({ message: "Author created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const { name, bio } = req.body;
    if (!name || !bio) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("authors").replaceOne(
      { _id: authorId },
      { name, bio }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Author updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("authors").deleteOne({ _id: authorId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Author deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};