const mongoose = require("mongoose");

// Create Schema
const carSchema = new mongoose.Schema({
    name: String,
    yearMade: String,
    isReadyToDrive: Boolean,
    carColor: String,
    carType: String,
    image: String
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;