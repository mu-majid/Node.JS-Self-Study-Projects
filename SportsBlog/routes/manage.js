const express = require('express');
const router = express.Router();

Category = require('../models/category.js')
Article = require('../models/article.js');

// GET request to manage all articles
router.get('/articles', (req, res) => {
    Article.getArticles((err, articles) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/manage_articles', {
            title: "Manage Your Articles",
            articles: articles
        });
    })

});

// GET request to add article
router.get('/articles/add', (req, res) => {
    // when adding article we choose its category
    Category.getCategories((err, categories) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/article_add', {
            title : "Create An Article",
            categories: categories
        });
    })

});

// GET request to add category
router.get('/categories/add', (req, res) => {
    res.render('manage/category_add', {
        title : "Create A Category"
    });
});

// GET request to edit an article
router.get('/articles/edit/:id', (req, res) => {
    Article.getArticle({_id: req.params.id}, (err, article) => {
        if (err) {
            res.send(err);
        }
        Category.getCategories((err, categories) => {
            res.render('manage/edit_article', {
                title: "Edit Article ",
                article: article,
                categories: categories
            });
        });

    });

});

// GET request to manage all categories
router.get('/categories', (req, res) => {
    Category.getCategories((err, categories) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/manage_categories', {
            title: 'Manage Your Categories',
            categories: categories
        });
    });
});

// GET request to edit a category
router.get('/categories/edit/:id', (req, res) => {
    Category.getCategory({_id: req.params.id}, (err, category) => {
        if (err) {
            res.send(err);
        }
        res.render('manage/edit_category', {
            title: "Edit Category ",
            category: category
        });
    });
});



module.exports = router