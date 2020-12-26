// config/database.js
module.exports = {
    'url': process.env.MONGODB_URL || "mongodb://localhost:27017/node-auth"
    // ví dụ: mongodb://<user>:<pass>@mongo.onmodulus.net:27017/databasename
};