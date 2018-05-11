const express = require('express');
const router = express.Router();
const passport = require('passport');

// Implementing local strategy
const LocalStrategy = require('passport-local').Strategy;

// requiriing the user model
const User = require('../models/user')

// Home GET
router.get('/',ensureAuthentication, (req, res ,next) => {
    res.render('index');
});

// Register Form
router.get('/login', (req, res) => {
    res.render('login');
});

// Register Form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Form processing
router.post('/register', (req, res) => {
    const name = req.body.name;
    const uname = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;
    const cpass = req.body.Cpassword;

    //using express validator
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('email', 'email field is required').notEmpty();
    req.checkBody('email', 'email field is not correct').isEmail();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('Cpassword', 'Passwords do not match').equals(req.body.password);

    // forming our errors object
    let errors = req.validationErrors();

    if (errors) {
        res.render("register", {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            username: uname,
            email: email,
            password: pass
        });
        User.registerUser(newUser, (err, user) => {
            if(err) throw err;
            req.flash('success_msg', 'You are registered and can login');
            res.redirect('/login');
        })
    }
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    User.findUserByUsername(username, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return done(null, false, {message: 'No User Found!!'})
        }
        // if user is found -- we need to compare the passwords
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password Is Incorrect!'})
            }
        })
    })
}))

// for session auth .. serialization of user to and from session is done
passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});


// Login processing
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req,res) => {
    req.logout()
    req.flash("success_msg", 'You Are Logged Out')
    res.redirect('/login')
})

// Access Control -- Middleware used before requesting index page
function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not authorized to view that page')
        res.redirect('/login');
    }
}

module.exports = router