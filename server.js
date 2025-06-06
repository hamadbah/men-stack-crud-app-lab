// required npm
// npm i ejs mongoose express method_override dotenv

const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require("path");

const app = express();
const PORT = 3000;

// Database Connection
mongoose.connect(process.env.MONGODB_URL);

// Establish the connection
mongoose.connection.on("connected", () => {
  console.log(`Connected to the database: ${mongoose.connection.name}`)
});

const Car = require("./models/car.js");

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads'));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// Parse the form body data
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));


// Require Controller 
const carCtrl = require('./controllers/cars');

// Use Controller
app.use('/', carCtrl);

app.listen(PORT, () => {
  console.log(`Server is on http://localhost:${PORT}`);
});