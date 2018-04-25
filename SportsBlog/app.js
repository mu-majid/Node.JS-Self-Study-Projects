const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

// mongose connection
mongoose.connect("mongodb://localhost:27017/sportsBlog");

// init app 
const app = express();
const indexRoute = require('./routes/index');
const manageRoute = require('./routes/manage');
const categoriesRoute = require('./routes/categories');
const articlesRoute = require('./routes/articles');

//set up views
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// static files
app.use(express.static(path.join(__dirname, "public")));

// Express Session middleware before any middleware and routes
app.use(session({
    secret: '963852741!@$',
    resave: false,
    saveUninitialized: true
}));

// from documentation how to use flash and express messages middleware
// https://github.com/expressjs/express-messages
// when req.flash() is used : the message set well be accessible from the global object messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Using moment middleware for formatting date (will be global to be accessed from anywhere)
app.locals.moment = require('moment');

// from documentation how to use express validator middleware
// https://github.com/ctavan/express-validator -- middleware options
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
        , root        = namespace.shift()
        , formParam   = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// our routers
app.use('/', indexRoute);
app.use('/articles', articlesRoute);
app.use('/manage', manageRoute);
app.use('/categories', categoriesRoute);

app.listen(3000, () => {
    console.log("Server started at 3000 ...");
})
