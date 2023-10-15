const mongoose = require('mongoose');
const log = console.log;

async function connect() {
    try {
        mongoose.Promise = global.Promise
        await mongoose.connect('mongodb+srv://lampng:vhoOvRTkwH8oWxst@nodejs-server.omzznkp.mongodb.net/api-graduation-project?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        log("| ".rainbow.bold + "kết nối cơ sở dữ liệu thành công!".green.underline.bold + "      |".rainbow.bold);
        log(`============================`.rainbow.bold)
    } catch (error) {
        log("Kết nối cơ sở dữ liệu thất bại!".red.strikethrough.bold);
    }
}
module.exports = {
    connect
};