const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
var mongo_db_object = require('../DatabaseConnection/mongodbConnection').getDB;


router.get('/todo', (req, res) => {
    let db = mongo_db_object();
    // fetch all tasks
    db.collection("Tasks").find({}).toArray((err, todos) => {
        if (err) {
            throw err;
        }
        res.render('index', {
            title: "Todo Application",
            todos: todos
        });
    });
});

router.post('/todo/add', (req, res) => {
    let db = mongo_db_object();
    let task = req.body.tskName;
    let taskBody = req.body.tskBody;
    let newTask = { 
        name: task,
        body: taskBody
    };
    db.collection("Tasks").insertOne(newTask, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.redirect('/todo');
});

router.delete('/todo/delete/:id', (req, res) => {
    var query = {_id : ObjectID(req.params.id)};
    let db = mongo_db_object();
    db.collection("Tasks").deleteOne(query, (err,response) => {
        if (err) {
            throw err;
        }
        console.log("Task Removed");
        res.sendStatus(200);
    });
});


router.get('/todo/edit/:id', (req, res) => {
    let db = mongo_db_object();
    // fetch Specific task
    var query = {_id : ObjectID(req.params.id)};
    db.collection("Tasks").findOne(query).then((todo) => {
        if (!todo) {
            throw new Error("Document Not Fornd!");
        }
        res.render('edit', {
            title: "Todo Application",
            todo: todo
        });
    });
});


router.post('/todo/edit/:id', (req, res) => {
    let db = mongo_db_object();
    let task = req.body.tskName;
    let taskBody = req.body.tskBody;
    let updateTask = { 
        name: task,
        body: taskBody
    };
    var query = {_id : ObjectID(req.params.id)};
    db.collection("Tasks").updateOne(query, {$set:updateTask},function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    });
    res.redirect('/todo');
});

module.exports = router;