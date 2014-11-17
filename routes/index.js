/**
 * Created by matt on 11/17/14.
 */
var port = process.env.PORT;
var db = process.env.DB;
var Hapi = require('hapi');
var Joi = require('joi');
var server = new Hapi.Server(port);