const express = require('express');
const router = express.Router();

Category = require('../models/category.js');

// GET request all categories
router.get('/', (req, res) => {
    Category.getCategories((err, categories) => {
        if (err) {
            res.send(err);
        }
        res.render('categories/all_categories', {
            title: 'All Categories',
            categories: categories
        });
    });
});


// add a category - POST
router.post('/add', (req, res) => {
    // using express validator
    req.checkBody('title', 'Title Is Required').notEmpty();
    // creating our errors object
    let errors = req.validationErrors();
    if (errors) {
        res.render('manage/category_add',{
            title: "Create A Category",
            errors: errors
        });
    } else {
        let category = new Category();
        category.title = req.body.title;
        category.description = req.body.desc;
        console.log("here");
        
        Category.addCategory(category, (err, category) => {
            if (err) {
                res.send(err);
            }
            // setting flash message
            req.flash('success', 'Category Added.');
            res.redirect('/manage/categories');
        });
    }

});

// Edit a category - POST
router.post('/edit/:id', (req, res) => {
    // using express validator
    req.checkBody('title', 'Title Is Required').notEmpty();
    // creating our errors object
    let errors = req.validationErrors();

    let category = {_id : req.params.id};
    if (errors) {
        res.render('manage/edit_category',{
            title: "Edit Category",
            errors: errors,
            category: category
        });
    } else {
        let update = {};
        const query = {_id: req.params.id}
        update.title = req.body.title;
        update.description = req.body.desc;
        Category.updateCategory(query, update, {}, (err, category) => {
            if (err) {
                res.send(err);
            }
            // setting flash message
            req.flash('success', 'Category Updated.');
            res.redirect('/manage/categories');
        });
    }
});

// delete category
router.delete('/delete/:id', (req, res) => {
    const query = {_id: req.params.id}
    Category.deleteCategory(query, (err, category) => {
        if (err) {
            res.send(err);
        }
        console.log(category);
        res.sendStatus(200);
    });
});




module.exports = router