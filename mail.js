var Imap = require('imap'),
    config = require('./config'),
    controller = require('./controller'),
    mimelib = require("mimelib");

var imap = new Imap({
    user: config.email,
    password: config.password,
    host: config.host,
    port: config.port,
    tls: true
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}
function getContent(buffer){
    var article = {}
    console.log(buffer)
    var div_pattern = /\<div[\s\S]*\<\/div\>/,
        date_pattern = /Date:.*/,
        subject_pattern = /Subject:.*/;

    var matches_div = buffer.match(div_pattern),
        matches_date = buffer.match(date_pattern),
        matches_subject = buffer.match(subject_pattern);

    if(matches_div != null){
        var content = mimelib.decodeQuotedPrintable(matches_div[0]);
        article.content=content;
    }
    if(matches_date != null)
        article.date = matches_date[0].split("Date:")[1]
    if(matches_subject != null)
        article.title = matches_subject[0].split("Subject:")[1]
    controller.insert(article);
}

function parseMail(msg){
    msg.on('body', function(stream, info) {
        var buffer = '';

        stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
        });

        stream.once('end', function() {
            getContent(buffer)
        });
    });
}

function mailListener(box){
    imap.on('mail', function(msg_id){

        var f = imap.seq.fetch('*', {
            bodies: '',
            struct: true
        });

        f.on('message', function(msg, seqno) {
            parseMail(msg);
        })
    })
}

imap.once('ready', function() {
    openInbox(function(err, box) {
        mailListener(box);
    })
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

imap.connect();
