require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
require("./config/db");

const port = process.env.port || 3000;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

const userRoutes = require("./routes/user");

app.use("/", userRoutes);


app.listen(port, () => {
    console.log(`Server started at port no ${port}`)
});