const express = require("express");
var path = require("path");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const knex = require("./knex");

const dir = path.join(__dirname, "images");
const initializePassport = require("./passport_config");
initializePassport(passport, getUserByEmail, getUserByID);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
  })
);
app.use(flash());
app.use(
  session({
    secret: "secretkey1234",
    cookie: { _expires: 60 * 60 * 1000 }, //60 minutes
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(dir));

// app.use(
//   cors({
//     origin: "http://localhost:3000", // <-- location of the react app were connecting to
//     credentials: true,
//   })
// );

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

//routes
app.post("/todo", checkAuthenticated, async (req, res) => {
  try {
    const { desc } = req.body;
    const newtodo = await pool.query(
      'INSERT INTO todo("desc","user_id") VALUES ($1, $2) RETURNING *',
      [desc, req.user.user_id]
    );
    res.json({ status: 200, message: "Added todo successfully!" });
  } catch (err) {
    console.error(err.message);
    res.json({ status: 500, message: "Error while adding todo" });
  }
});
app.get("/products", checkAuthenticated, async (req, res) => {
  try {
    const products = knex
      .select("products.*", "categories.name as category")
      .from("products")
      .innerJoin("categories", "products.category", "categories.id")
      .where("categories.permission", ">=", req.user.permission);
    products.then((data) => {
      res.json({ status: 200, message: "Success", data: data });
    });
  } catch (err) {
    console.error(err.message);
    res.json({ status: 500, message: "Error" });
  }
});
app.get("/todo/:id", checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const newtodo = await pool.query(
      "SELECT * FROM todo WHERE id = $1 AND user_id = $2",
      [id, req.user.user_id]
    );
    res.json({ status: 200, message: "Success", data: newtodo.rows });
  } catch (err) {
    console.error(err.message);
    res.json({ status: 500, message: "Error" });
  }
});
app.put("/todo/:id", checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { desc } = req.body;
    const newtodo = await pool.query(
      'UPDATE todo SET "desc"=$1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [desc, id, req.user.user_id]
    );
    res.json({ status: 200, message: "Success" });
  } catch (err) {
    console.error(err.message);
    res.json({ status: 500, message: "Error" });
  }
});
app.delete("/todo/:id", checkAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const newtodo = await pool.query(
      "DELETE FROM todo WHERE id = $1 AND user_id =$2",
      [id, req.user.user_id]
    );
    res.json({ status: 200, message: "Success" });
  } catch (err) {
    console.error(err.message);
    res.json({ status: 500, message: "Error" });
  }
});

app.get("/checkauthentication", checkAuthenticated, async (req, res) => {
  res.json({ status: 200, message: "User is logged in" });
});

app.get("/testfail", async (req, res) => {
  console.log(req.flash("error"));
  res.json({ status: 200, message: "sorry, you are not logged in!" });
});

app.post("/login", checkNotAuthenticated, async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return res.json({ status: 500, message: err });
    }
    if (!user) {
      return res.json({ status: 401, message: info.message });
    }
    req.logIn(user, function (err) {
      if (err) {
        return res.json({ status: 500, message: err });
      }
      // req.session.user = req.user;
      return res.json({ status: 200, message: "User successfully logged in!" });
    });
  })(req, res, next);
});

app.get("/logout", async (req, res) => {
  req.logOut();
  res.json({ status: 200, message: "User successfully logged out!" });
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const userPassword = await bcrypt.hash(req.body.password, 10);
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userWithSameEmail = await getUserByEmail(userEmail);
    if (userWithSameEmail) {
      res.json({ status: 400, message: "User with same email exists!" });
    } else {
      const newUser = await knex("users").insert({
        name: userName,
        email: userEmail,
        password: userPassword,
      });
      res.json({ status: 200, message: "Successfully registered!" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: 500, message: "Error: " + err });
  }
});

async function getUserByID(id) {
  try {
    const users = await knex.select().from("users").where("user_id", id);
    return users[0];
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

async function getUserByEmail(email) {
  try {
    const users = await knex.select().from("users").where("email", email);
    return users[0];
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.json({ status: 401, message: "Not authourised!" });
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.json({ status: 200, message: "already logged in" });
  }
  next();
}

app.listen(5000, () => {
  console.log("app has started on port 5000");
});
