const express = require("express");
const bodyParser = require("body-parser");
var cookies = require("cookie-parser");
const app = express();

// MongoDB
var mongoDB = require('./database/config/DatabaseConnection');
var cors = require('cors')

// Bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookies());
app.use(cors());

//Connect to DB and setup routes there
mongoDB.connectToServer( function( err ) {
    //app goes online once this callback occurs
    if (err) console.log(err);
    else console.log("Connection to the Mongo Database successful!");
    // Routes
    const admin = require('./api/admin/admin');
    const client = require("./api/client/client");
    const support = require("./api/support/support");
    const login = require("./api/shared/login");
    app.use("/api/admin", admin);
    app.use("/api/client", client);
    app.use("/api/support", support);
    app.use("/api/login", login);
});

app.listen(3001, () => console.log(`Server is running on port 3001.`));

module.exports = app; 