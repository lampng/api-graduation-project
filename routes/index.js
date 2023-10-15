const userAPI = require('./userAPI');
const clientAPI = require('./clientAPI');

function route(app) {
    app.use('/user', userAPI);
    app.use('/client', clientAPI);
}
module.exports = route;