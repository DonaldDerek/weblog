var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

ArticleSchema = new Schema({
    title: {type: String},
    content: {type: String},
    date  : {type : Date, default : Date.now}
});

mongoose.model('Article', ArticleSchema)
