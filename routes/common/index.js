'use strict';
var commons = require('./commonsController');
var luis = require('./luisCtrl');
module.exports = function(app) {
	app.post('/api/user/add',commons.addUser);
	app.get('/api/user/fetch',commons.fetchUser);
	app.post('/api/user/update',commons.updateUser);
	app.post('/api/user/login',commons.loginUser);
	app.post('/api/luis/data',luis.getAIResponse);
};
