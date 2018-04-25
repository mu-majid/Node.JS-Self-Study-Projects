const express = require('express');
const router = express.Router();

// GET request
router.get('/', (req, res) => {
    Article.getArticles( (err, articles) => {
        res.render('index/index', {
            title: "Index",
            articles: articles
        });
    });
});




module.exports = router