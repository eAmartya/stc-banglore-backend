const mongoose = require("mongoose");
const { boolean } = require("zod");

// const AppealingSchema = new mongoose.Schema({
//   pincode: {
//     type: String,
//     required: true,
//   },
//   area: {
//     type: String,
//     required: true,
//   },
//   isNewPincode: {
//     type: String,
//     required: true
//   },
//   reqMadeBy: {
//     type: String,
//     required: true
//   }
// })
const AppealingSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  }
})

// const AppealingModel =

module.exports = mongoose.model('Appeal', AppealingSchema);