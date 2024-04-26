require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const zod = require("zod");
const cors = require("cors")
const app = express();
const port = 8000;
const connectToDatabase = require('./db')
const { appealBodySchema, searchZodSchema, notesBodySchema } = require("./models/zodSchema");
const PincodeCityMapping = require('./models/PincodeCityMapping');
const AppealingModel = require('./models/Appealing');
const NotesModel = require("./models/Notes")
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
app.get("/compile_specific", async (req, res) => {
  let whatArea = req.query.area;
  if (!whatArea) {
    res.json({
      data: [],
      success: false,
      msg: "no input"
    })
  } else {
    let data = await PincodeCityMapping.find({ area: whatArea });
    console.log(data)
    try {
      if (!data[0]) {
        res.json({
          data: data,
          success: false
        })
      } else {
        res.json({
          data: data,
          success: true,
        })
      }
    } catch (error) {
      console.log("err:" + error)
    }



  }
})
app.get("/appeal/read", async (req, res) => {
  try {
    const result = await AppealingModel.find({})
    // console.log(result)
    if (!result) {
      return res.json({
        msg: "nothing to show",
        success: true,
        isEmpty: true
      })
    } else {
      return res.json({
        msg: "found appeals",
        data: result,
        success: true,
        isEmpty: false
      })
    }
  } catch (error) {
    return res.status(500).json({
      msg: "internal server error",
      success: false,
      isEmpty: true
    })
  }
})
app.post("/appeal/write", async (req, res) => {
  const reqData = req.body;
  console.log(reqData)
  if (!reqData.pincode || !reqData.area) {
    return res.json({
      msg: "invalid inputs",
      success: false
    })
  }
  let success = appealBodySchema.safeParse(reqData);
  if (!success.success) {
    return res.json({
      msg: "wrong inputs, follow the schema which is pincode followed by the area name",
      success: false
    })
  } else {
    try {
      const newData = new AppealingModel({
        pincode: reqData.pincode,
        area: reqData.area,
      });
      await newData.save()
      return res.status(201).json({
        msg: "appeal saved",
        success: true
      })
    } catch {

      return res.status(500).json({
        msg: "internal server error cant save user rn",
        success: false
      })
    }
  }

})

app.post("/notes/write", async (req, res) => {
  const notesBody = req.body;
  const success = notesBodySchema.safeParse(notesBody);

  if (!success.success) {
    return res.json({
      msg: "invalid inputs",
      success: false,
      isEmpty: true
    })
  } else {
    if (!notesBody.note) {
      return res.json({
        msg: "empty note",
        success: false,
        isEmpty: true
      })
    } else {
      try {
        const newNote = new NotesModel({
          note: notesBody.note
        })
        await newNote.save()
        return res.status(201).json({
          msg: "note saved",
          success: true
        })
      } catch {
        return res.status(500).json({
          msg: "internal server error cant save user rn",
          success: false
        })
      }
    }
  }
})
app.get("/notes/read", async (req, res) => {
  try {
    const result = await NotesModel.find({})
    // console.log(result)
    if (!result) {
      return res.json({
        msg: "nothing to show",
        success: true,
        isEmpty: true
      })
    } else {
      return res.json({
        msg: "found notes",
        data: result,
        success: true,
        isEmpty: false
      })
    }
  } catch (error) {
    return res.status(500).json({
      msg: "internal server error",
      success: false,
      isEmpty: true
    })
  }
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
