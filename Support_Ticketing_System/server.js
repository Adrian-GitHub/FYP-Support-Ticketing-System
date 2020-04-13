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
    const admin = require('./api/routes_admin');
    const client = require('./api/routes_client');
    const client_ticket = require('./api/routes_client_ticket');
    const support = require("./api/routes_support");
    const camunda = require("./api/routes_camunda");
    const login = require("./api/routes_auth");
    app.use("/api/admin", admin);
    app.use("/api/client", client);
    app.use("/api/ticket", client_ticket);
    app.use("/api/support", support);
    app.use("/api/camunda", camunda);
    app.use("/api/login", login);
});

app.listen(3001, () => console.log(`Server is running on port 3001.`));

module.exports = app; 