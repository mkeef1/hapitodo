var port = process.env.PORT;
var db = process.env.DB;
var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server(port);

var mongoose = require('mongoose');
mongoose.connect(db);

var Schema = mongoose.Schema;

var prioritySchema = new Schema({name: String, color: String});
var taskSchema = new Schema({name: String, priority: {type: Schema.Types.ObjectId, ref: 'Priority'}});


var Priority = mongoose.model('Priority', prioritySchema);
var Task = mongoose.model('Task', taskSchema);

server.route({
    method: 'PUT',
    path: '/tasks/{id}',
    handler: function(req, rep){
        Task.findOneAndUpdate(req.params._id, req.payload, function(err, task){
            rep(task);
        });
    }
});

server.route({
    method: 'GET',
    path: '/tasks/{id}',
    handler: function(req, rep){
        var query = Task.where({id: req.payload});
        query.findOne(function(err, task){
            rep(task);
        })
    }
});


server.route({
    method: 'GET',
    path: '/tasks',
    handler: function(req, rep){
        Task.find().populate('priority').exec(function(err, tasks){
            rep(tasks);
        });
    }

});

server.route({
    method: 'POST',
    path: '/tasks',
    handler: function(req, rep){
        var task = new Task(req.payload);
            task.save(function(){
            rep(task);
        })
    }
});

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
    path: '/priorities',
    handler: function(req, rep){
        Priority.find(function(err, priorities){
            rep(priorities);
        });
    },
    config:{
        validate:{
            params:{
                name: Joi.string().min(1),
                color: Joi.string().min(1)
            }

        }
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