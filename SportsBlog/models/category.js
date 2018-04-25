const mongoose = require('mongoose');

// Creating our category schema

/* Once you've created a schema you can use it to create models. The model represents a collection of documents in the database that you can search, while the model's instances represent individual documents that you can save and retrieve.*/

const categorySchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }
});

// mapping our schema to a collection in  mongodb using our schema and export that model to be used
// Category variable is what we will export and use as our model that we will create instances from
var Category = module.exports = mongoose.model("Category", categorySchema);

// to keep everything encapsulated in the model file we will create some helper functions

module.exports.getCategories = (callBack, limit) => {
    Category.find(callBack).limit(limit).sort([['title', 'ascending']])
}

module.exports.addCategory = (category, callback) => {
    Category.create(category, callback);
}

module.exports.getCategory = (query, callback) => {
    Category.findById(query, callback);
}

module.exports.updateCategory = (query, update, options, callback) => {
    // using find and update to get the updated document
    // using update will only return number of the updated documents
    Category.findByIdAndUpdate(query, update, options, callback);
}

module.exports.deleteCategory = (query, callback) => {
    Category.remove(query, callback);
}