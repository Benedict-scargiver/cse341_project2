const mongodb = require("../database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db("csewk1-2")
    .collection("users")
    .find();
  result.toArray().then((users) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
  });
};

const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  const result = await mongodb
    .getDatabase()
    .db("csewk1-2")
    .collection("users")
    .findOne({ _id: userId });

  if (result) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } else {
    res.status(404).json({error: "User not found"})
  }
};

const createUser = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({ error: "First name, last name, and email are required" });
    }

    // Check if email already exists
    const existingUser = await mongodb
      .getDatabase()
      .db("csewk1-2")
      .collection("users")
      .findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    
    const result = await mongodb
      .getDatabase()
      .db("csewk1-2")
      .collection("users")
      .insertOne(user);
      
    if (result.acknowledged) {
      res.status(201).json({ message: "User created successfully", userId: result.insertedId });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while creating user" });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({ error: "First name, last name, and email are required" });
    }

    const userId = new ObjectId(req.params.id);
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    
    const response = await mongodb
      .getDatabase()
      .db("csewk1-2")
      .collection("users")
      .replaceOne({ _id: userId }, user);
      
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while updating user" });
  }
};

const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDatabase()
    .db("csewk1-2")
    .collection("users")
    .deleteOne({ _id: userId }, true);
  if (response.deletedCount > 0) {
    res.status(200).json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
