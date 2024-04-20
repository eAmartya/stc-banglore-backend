const mongoose = require("mongoose");

const PincodeCityMappingSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('PincodeCityMapping', PincodeCityMappingSchema)