const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    userID: String,
    email: String,
    name: String,
    phone: String,
    // city: String,
    // districts: String,
    // wards: String,
    latitude: Number,
    feeShip: Number,
    longitude: Number,
    address: String,
    typeAddress: String,

});

module.exports = mongoose.model('customers', customerSchema);