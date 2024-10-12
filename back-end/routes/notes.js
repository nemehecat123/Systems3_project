const express = require("express");
const notes = express.Router();
const DB = require('../db/dbConn.js');
const multer = require("multer");
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');
const app = express()

 // kje so noti shranjeni
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads/notes');
    },
    filename: (req, file, callBack) => {
        callBack(null, `${Date.now()}_${file.originalname}`);
    }
});

let upload_dest = multer({ dest: 'uploads/notes/' });



// Route to get all notes for the logged-in user
notes.get('/', async (req, res, next) => {
  const authHeader = req.headers['authorization']; // Get the Authorization header
  const UserID = authHeader.split(' ')[1];

  console.log(DB)
  try {
        const queryResult = await DB.getAllClassesForUser(UserID);
        res.json(queryResult);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Server error" });
        next();
    }
});








module.exports = notes;