const express = require("express");
const bodyParser = require("body-parser");


const port = process.env.port || 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello World!!");
})

app.listen(port, () => {
    console.log(`Server started at port no ${port}`)
});