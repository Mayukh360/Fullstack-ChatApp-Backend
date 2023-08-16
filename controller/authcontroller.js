const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");


const signup = async (req, res) => {
  // console.log(req.body)
  const { name, email, password,phonenumber } = req.body;

  try {
    // Checking if the email already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user with the hashed password
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phonenumber,
      
    });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { userId: newUser.id, name: newUser.name },
      "abcdxyztrsdgpjslyytfdcbf"
    );

    res.json({ token, userId: newUser.id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

const login = async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;

  try {
    // Find the user in the database (using Sequelize model)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    // Compare the provided password with the hashed password
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      "abcdxyztrsdgpjslyytfdcbf"
    );

    // Return the token and userId in the response
    res.json({ token, userId: user.id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login };
