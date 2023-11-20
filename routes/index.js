const userAPI = require('./userAPI');
const clientAPI = require('./clientAPI');
const serviceAPI = require('./serviceAPI');
const cartAPI = require('./cartAPI');

function route(app) {
    app.use('/user', userAPI);
    app.use('/client', clientAPI);
    app.use('/service', serviceAPI);
    app.use('/cart', cartAPI);
}
module.exports = route;