const userAPI = require('./userAPI');
const clientAPI = require('./clientAPI');
const serviceAPI = require('./serviceAPI');
const cartAPI = require('./cartAPI');
const orderAPI = require('./orderAPI');
const statisticAPI = require('./statisticAPI');

function route(app) {
    app.use('/user', userAPI);
    app.use('/client', clientAPI);
    app.use('/service', serviceAPI);
    app.use('/cart', cartAPI);
    app.use('/order', orderAPI);
    app.use('/statistic', statisticAPI);
}
module.exports = route;