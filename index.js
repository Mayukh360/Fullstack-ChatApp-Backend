const express = require("express");
const cors = require("cors");
const sequelize = require("./database/database");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Chat = require("./models/chat");
const authController = require("./controller/authcontroller");
const Groups = require("./models/groups");
const Usergroups = require("./models/usergroup");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const token = req.headers.authorization;
  // console.log(token);
  if (token) {
    const decodedToken = jwt.verify(token, "abcdxyztrsdgpjslyytfdcbf");
    const userId = decodedToken.userId;
    // console.log("USERID", userId);
    User.findByPk(userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
        next();
      });
  } else {
    next();
  }
});

app.post("/signup", authController.signup);
app.post("/login", authController.login);

app.post("/chats", async (req, res) => {
  console.log(req.body);
  try {
    if (!req.user) {
      res.status(401).json({ error: "Invalid User" });
    }
    const { message } = req.body;
    console.log(req.user.dataValues.id);
    const newChat = await Chat.create({
      userId: req.user.dataValues.id,
      message: message,
    });

    res.status(201).json({ data: newChat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getAllMessage", async (req, res) => {
  console.log(req.user);
  try {
    const message = await Chat.findAll({
      attributes: ["message", "userId", "id"],
      include: [{ model: User, attributes: ["name"] }],
    });
    res.status(201).json({ data: message });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.post("/creategroup", async (req, res) => {
  try {
    const { groupname } = req.body;
    const userId = req.user.dataValues.id; 
    const phonenumber = req.user.phonenumber;

    const group = await Groups.create({
      groupname: groupname,
      phonenumber: phonenumber,
    });

    // Associate the user with the created group
    await group.setUser(userId);

    res.status(201).json({ data: group });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get("/admingroups", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Invalid User" });
    }

    const userId = req.user.dataValues.id;

    // Retrieve group names where userId matches
    const groups = await Groups.findAll({
      attributes: ["groupname","id"],
      where: {
        userId: userId,
      },
    });

    res.status(200).json({ data: groups });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});



User.hasMany(Chat);
Chat.belongsTo(User);
User.hasMany(Groups);
Groups.belongsTo(User);
Groups.hasMany(Chat);
Chat.belongsTo(Groups);
User.hasMany(Usergroups);
Groups.hasMany(Usergroups);
Usergroups.belongsTo(User);
Usergroups.belongsTo(Groups);

sequelize
  .sync()
  .then((result) => {
    console.log("Database synced");
    return User.findByPk(1);
  })
  .then((user) => {
    // console.log(user);
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
