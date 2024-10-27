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

  try {
    const queryResult = await DB.getAllNotesForUser(id_classes); // id_classes stevilko rabis da vidis "Listek"
    if (queryResult.length === 0) {
      return res.status(404).json({ success: false, msg: "Note not found" });
    }

    const images = queryResult.map((note) => ({
        data: note.Blob_Note.toString('base64'), // Convert to base64
        fileName: note.file_name || 'image.png',  // Optional filename
        description: note.description,            // Optional metadata, e.g., description
        fileType: 'image/png'                     // Assuming all are PNGs, adapt if needed
      }));

      // Send back an array of images
    res.json({ success: true, images });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Server error" });
    next();
      }
  });

module.exports = notes;