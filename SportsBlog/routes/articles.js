const express = require('express');
const router = express.Router();

Article = require('../models/article.js');
Category = require('../models/category.js')

// GET request all articles
router.get('/', (req, res) => {
    Article.getArticles( (err, articles) => {
        res.render('articles/all_articles', {
            title: 'All Articles',
            articles: articles
        });
    });
});

// GET request single article
router.get('/show/:article_id', (req, res) => {
    Article.getArticle(req.params.article_id, (err, article) => {
        res.render('articles/article', {
            title: article.title,
            article: article
        });
    });
});

// GET request categories of articles
router.get('/category/:category_id', (req, res) => {
    Article.getArticlesByCategory(req.params.category_id, (err, articles) => {
        Category.getCategory(req.params.category_id, (err, category) => {
            res.render('articles/all_articles', {
                title: category.title +  ' Articles',
                articles: articles
            });
        });
    });
});

// adding ana article POST
router.post('/add', (req, res) => {
    console.log(req.body);
    
    // our validations
    req.checkBody('title', 'Title Is Required').notEmpty();
    req.checkBody('body', 'Body Is Required').notEmpty();
    req.checkBody('category', 'Category Is Required').notEmpty();
    req.checkBody('author', 'Author Is Required').notEmpty();
    
    // creating errors object
    let errors = req.validationErrors();

    if (errors) {
        // remember getting categories to render the article_add view
        Category.getCategories((err, categories) => {
            res.render('manage/article_add', {
                title: "Create An Article",
                errors: errors,
                categories: categories
            });
        });
    } else {
        let article = new Article({
            title: req.body.title,
            subtitle: req.body.subtitle,
            category: req.body.category,
            author: req.body.author,
            body: req.body.body
        });
        Article.addArticle(article, (err, article) => {
            if (err) {
                res.send(err);
            }
            // setting flash message
            req.flash('success', 'Article Added.');
            res.redirect('/manage/articles');
        });
    }
});

// adding ana article POST
router.post('/edit/:id', (req, res) => {
    // our validations
    req.checkBody('title', 'Title Is Required').notEmpty();
    req.checkBody('body', 'Body Is Required').notEmpty();
    req.checkBody('category', 'Category Is Required').notEmpty();
    req.checkBody('author', 'Author Is Required').notEmpty();
    
    // creating errors object
    let errors = req.validationErrors();
    let article = {_id: req.params.id}
    if (errors) {
        Category.getCategories((err, categories) => {
            res.render('manage/edit_article', {
                title: "Edit An Article",
                errors: errors,
                categories: categories,
                article: article
            });
        });
    } else {
        const update = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            category: req.body.category,
            author: req.body.author,
            body: req.body.body
        };
        const query = {_id: req.params.id};
        Article.updateArticle(query, update, {}, (err, article) => {
            if (err) {
                res.send(err);
            }
            // setting flash message
            req.flash('success', 'Article Updated.');
            res.redirect('/manage/articles');
        });
    }
});

// delete article
router.delete('/delete/:id', (req, res) => {
    const query = {_id: req.params.id}
    Article.deleteArticle(query, (err, article) => {
        if (err) {
            res.send(err);
        }
        res.sendStatus(200);
    });
});

router.post('/comments/add/:id', (req, res) => {
    // our validations
    req.checkBody('comment_subject', 'Subject Is Required').notEmpty();
    req.checkBody('comment_body', 'Body Is Required').notEmpty();
    req.checkBody('comment_author', 'Author Is Required').notEmpty();

    // creating errors object
    let errors = req.validationErrors();
    if (errors) {
        Article.getArticle(req.params.id, (err, article) => {
            res.render('articles/article', {
                title: article.title,
                article: article, 
                errors: errors
            });
        });
    } else {
        let query = {_id: req.params.id}
    
        let comment = {
          comment_subject: req.body.comment_subject,
          comment_author: req.body.comment_author,
          comment_body: req.body.comment_body,
          comment_email: req.body.comment_email,
        }
    
        Article.addComment(query, comment, (err, article) => {
          res.redirect('/articles/show/'+req.params.id);
        });
    }
});


module.exports = router