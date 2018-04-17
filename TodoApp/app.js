const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongo = require('./DatabaseConnection/mongodbConnection');

/* CONFIGURING THE APPLICATION */

//setting up views
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setting up static files and body parser middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//requiring Routers
const homeRouter = require('./routes/home');

// routes
app.use('/', homeRouter);

/* Once the application is running it connects to Mongo so that other components can use the already established connections with the database. */

// connecting to database then start the app
mongo.connectToMongoServer((err) => {
    if (err) {
        throw err;
    }
    // starting the application
    app.listen(3000, () => {
	    console.log("Server started at 3000 ...");
	});

});


