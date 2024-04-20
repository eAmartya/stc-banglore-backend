require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const zod = require("zod");
const cors = require("cors")
const app = express();
const port = 8000;
const connectToDatabase = require('./db')
const { writeAdminBodySchema, searchZodSchema } = require("./models/zodSchema");
const PincodeCityMapping = require('./models/PincodeCityMapping');
app.use(express.json());
app.use(cors());

connectToDatabase()
  .then(() => { })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get("/", (req, res) => {
  res.json({
    msg: "go to a certain route"
  })
})

app.get("/search", (req, res) => {
  let pincode = req.query.pin;
  if (!isNaN(pincode)) {
    PincodeCityMapping.find({ pincode: pincode })
      .then((data) => {
        console.log(data)
        if (!data[0]) {
          // console.log("found data");
          res.json({
            data: data,
            success: false
          })
        } else {
          res.json({
            data: data,
            success: true
          })
        }
      }).catch((err) => {
        console.log(err);
        res.json({
          msg: "error",
          err: err
        })
      })
  } else {
    res.json({
      msg: "wrong inputs, please follow the search Schema which is just the pincode"
    })
  }
})

app.post("/admin/write", (req, res) => {
  const reqData = req.body;
  let success = writeAdminBodySchema.safeParse(reqData);
  if (!success.success) {
    res.status(411).json({
      msg: "wrong inputs, follow the schema which is pincode followed by the area name"
    })
  } else {
    const newPincode = new PincodeCityMapping({
      pincode: reqData.pincode,
      area: reqData.area
    });
    newPincode.save()
      .then((savedPincode) => {
        console.log("Pincode saved: ", savedPincode)
        res.json({
          data: savedPincode,
          msg: "saved",
        })
      })
      .catch((err) => {
        console.log("Error saving user: ", err)
        res.json({
          data: err,
          msg: "Error saving",
        })
      })
  }

})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
