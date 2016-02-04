/*Module Dependecies*/
var connect = require('connect'),
    render = require('connect-render'),
    http = require('http'),
    mongoose = require('mongoose'),
    config = require('./config'),
    ejs=require('ejs'),
    compression = require('compression'),
    controller = require('./controller'),
    mail = require('./mail');

/*EJS Renderer*/
var renderer = render({
    root: __dirname + '/views',
    layout: 'layout.html',
    cache: false,
    helpers: {
        sitename: 'WebLog',
        starttime: new Date().getTime(),
        now: function (req, res) {
            return new Date();
        }
    }
});

/* Database */
mongoose.connect(config.db)

var app = connect(renderer);

/* Middlewares */
app.use(compression());

/* Routes */
app.use('/blog',controller.find);

/* Run HTTP Server */
var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(3000)

/* WebSockets
var io = require('socket.io-connect');
io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
    });
});*/
