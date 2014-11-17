var port = process.env.PORT;
var db = process.env.DB;
var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server(port);

var mongoose = require('mongoose');
mongoose.connect(db);

var Priority = mongoose.model('Priority', {name: String, color: String});

server.route({
    method: 'POST',
    path: '/priorities',
    handler: function(req, rep){
        var priority = new Priority(req.payload);
        priority.save(function(){
            rep(priority);
        });
    }
});

server.route({
    method: 'GET',
    path: '/priorities/{param*}',
    handler: function(req, rep){
        Priority.find(function(err, priorities){
            rep(priorities);
        });
    }
});

server.route({
    config:{
        description: 'this is the home page',
        notes: 'sweet notes',
        tags: ['home', 'b', 'c']
    },
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    config:{
      description: 'this is the about page'
    },
    method: 'GET',
    path: '/about',
    handler: function(req, rep){
        rep('about page');
    }
});

server.pack.register(
    [
        {
            plugin: require('good'),
            options: {
                reporters: [{
                    reporter: require('good-console'),
                    args:[{ log: '*', request: '*' }]
                }]
            }
        },
        {plugin: require('lout') }
    ], function (err) {
        if (err) {
            throw err; // something bad happened loading the plugin
        }

        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });