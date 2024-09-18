const express = require("express");
const notes = express.Router();
const DB = require('../db/dbConn.js'); // Assume DB functions for notes are added here
const multer = require("multer");
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
    try {
        const userId = req.session.user.id; // assuming the user ID is stored in session
        const queryResult = await DB.getAllNotesForUser(userId);
        console.log("tle dobi podatke in pride do sm")
        res.json(queryResult);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
        next();
    }
});






module.exports = notes;