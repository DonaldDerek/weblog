var mongoose = require('mongoose'),
    model = require('./model');

Article = mongoose.model('Article');

exports.insert = function(article){
    var art = new Article(article);
    art.save()
}

exports.find = function(req,res){
    Article.find().sort('-date').exec(function(err, results){
        res.render('index.html', { articles: results, layout: false });
    })
}
