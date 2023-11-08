const userAPI = require('./userAPI');
const clientAPI = require('./clientAPI');
const serviceAPI = require('./serviceAPI');

function route(app) {
    app.use('/user', userAPI);
    app.use('/client', clientAPI);
    app.use('/service', serviceAPI);
}
module.exports = route;