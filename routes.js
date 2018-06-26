module.exports = function(app){

		var application = require('./routes/application');
		var users = require('./routes/users');
		var homepage = require('./routes/homepage');
		var screenshots = require('./routes/screenshots');

		app.use('/', application);
		app.use('/users', users);
		app.use('/homepage', homepage);
		app.use('/screenshots',screenshots);
    //other routes..
}