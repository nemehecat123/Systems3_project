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
  console.log(UserID);
  try {
        const queryResult = await DB.getAllClassesForUser(UserID);
        console.log(queryResult);
        res.json(queryResult);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "Server error" });
        next();
    }
});


notes.get('/getNotes', async (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the Authorization header
  const id_classes = authHeader.split(' ')[1]; // Extract user ID from token
  console.log("id_classes :", id_classes);

  try {
    const queryResult = await DB.getAllNotesForUser(id_classes); // id_classes stevilko rabis da vidis "Listek"
    if (queryResult.length === 0) {
      return res.status(404).json({ success: false, msg: "Note not found" });
    }

    const fileData = queryResult[0].file_blob;  // Assuming the file blob is stored in a `file_blob` column
    const fileName = queryResult[0].file_name || 'downloaded_file';  // Assuming you store the filename too

    // Setting headers to return the file correctly
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Return the note data
    res.json(queryResult[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Server error" });
    next();
      }
  });

module.exports = notes;