const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new mongoose.Schema({
    ProductName: {
        type: String,
        require: true
    },
    Quantity: {
        type: Number,
        require: true
    },
    Amount: {
        type: Number,
        require: true
    },

},{timestamps: true})

module.exports = mongoose.model("saleModel", saleSchema)
