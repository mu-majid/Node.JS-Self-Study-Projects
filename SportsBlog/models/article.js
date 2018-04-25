const mongoose = require('mongoose');

// Creating our article schema

/* Once you've created a schema you can use it to create models. The model represents a collection of documents in the database that you can search, while the model's instances represent individual documents that you can save and retrieve.*/

const articleSchema = mongoose.Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    category: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    comments: [{
        comment_subject: {
            type: String
        },
        comment_body: {
            type: String
        },
        comment_author: {
            type: String
        },
        comment_email: {
            type: String
        },
        comment_date: {
            type: String
        },
    }]
});

// mapping our schema to a collection in  mongodb using our schema and export that model to be used
// Article variable is what we will export and use as our model that we will create instances from
var Article = module.exports = mongoose.model("Article", articleSchema);

// to keep everything encapsulated in the model file we will create some helper functions

module.exports.getArticles = (callBack, limit) => {
    Article.find(callBack).limit(limit).sort([['title', 'ascending']])
}

// Get articles by category
module.exports.getArticlesByCategory = (categoryId, callback) => {
    let query = {category: categoryId}
    Article.find(query, callback).sort([['title', 'ascending']])
}

module.exports.addArticle = (article, callback) => {
    Article.create(article, callback);
}

module.exports.getArticle = (query, callback) => {
    Article.findById(query, callback);
}

module.exports.updateArticle = (query, update, options, callback) => {
    // using find and update to get the updated document
    // using update will only return number of the updated documents
    Article.findByIdAndUpdate(query, update, options, callback);
}

module.exports.deleteArticle = (query, callback) => {
    Article.remove(query, callback);
}

// Add comment
module.exports.addComment = function(query, comment, callback){
    Article.update(query,
      {
        $push: {
          comments: comment
        }
      },
      callback
    );
  }