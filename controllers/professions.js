const mongodb = require("../database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db("csewk1-2").collection("professions").find();
    result.toArray().then((professions) => {
      res.status(200).json(professions);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const professionId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const profession = await mongodb.getDatabase().db("csewk1-2").collection("professions").findOne({ _id: professionId });
    if (!profession) return res.status(404).json({ error: "Not found" });
    res.status(200).json(profession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProfession = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("professions").insertOne({ name, description });
    res.status(201).json({ message: "Profession created", id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfession = async (req, res) => {
  try {
    const professionId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("professions").replaceOne(
      { _id: professionId },
      { name, description }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Profession updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProfession = async (req, res) => {
  try {
    const professionId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const result = await mongodb.getDatabase().db("csewk1-2").collection("professions").deleteOne({ _id: professionId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Profession deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createProfession,
  updateProfession,
  deleteProfession,
};