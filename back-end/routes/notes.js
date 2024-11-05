const express = require("express");
const notes = express.Router();
const DB = require('../db/dbConn.js');
const multer = require("multer");
const cookieParser = require('cookie-parser');
const upload = multer({ storage: multer.memoryStorage() });
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

  console.log(id_classes +  ":  id classes ljudi hihihi")
  try {
    const queryResult = await DB.getAllNotesForUser(id_classes); // id_classes stevilko rabis da vidis "Listek"
    if (queryResult.length === 0) {
      return res.status(404).json({ success: false, msg: "Note not found" });
    }

    const images = queryResult.map((note) => ({
        id_notes: note.id_notes, // Include id_notes in the response
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

  notes.post('/createNewClass', async (req, res) => {
    const authHeader = req.headers['authorization']; // Get the Authorization header
  const id_users = authHeader.split(' ')[1]; // Extract user ID from token
    const { name, description, teacher, yearOfClass } = req.body;
    
    try {
      const newNote = {
        id_users,
        name,
        description,
        teacher,
        yearOfClass,
      };

      console.log(newNote);
  

 
      await DB.createNewClass(newNote); // Adjust this to match your database logic
      res.status(201).json({ success: true, message: 'Note created successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });




  notes.post('/addNoteWithImages', upload.array('images'), async (req, res) => {
    const authHeader = req.headers['authorization'];
    const id_classes = authHeader.split(' ')[1];
  
    const imageFiles = req.files; // Multer stores multiple files in req.files

    console.log(id_classes);
    console.log(imageFiles);
  
    try {
      const newNote = {
        id_classes,
      };

      const images = imageFiles.map((file) => file.buffer);

  
      // Assuming createNewNoteWithImages is a function to handle the images in your database
      await DB.createNewNoteWithImages(newNote,images);
  
      res.status(201).json({ success: true, message: 'Note created successfully with images!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });


  // Backend route to search for classes by name
    notes.get('/searchClasses', async (req, res) => {
        const { query } = req.query; // Get the search query from the request

        console.log(query);
    
        try {
        const searchResults = await DB.searchClassesByName(query);
        res.status(200).json(searchResults);
        } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ success: false, message: "Server error" });
        }
    });


    notes.delete('/deleteClass', async (req, res) => {
        const { id } = req.body; // Get `id` directly from the request body
      
        try {
          const result = await DB.deleteClass(id); // Pass the `id` variable from request body
      
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Class not found" });
          }
      
          res.status(200).json({ success: true, message: "Class deleted successfully" });
        } catch (error) {
          console.error("Error deleting class:", error);
          res.status(500).json({ success: false, message: "Failed to delete class" });
        }
      });

      notes.delete('/deleteNote', async (req, res) => {
        const { id_notes } = req.body;  // Get the note ID from the request body
        console.log(req.body)
        
        try {
          const result = await DB.deleteNote(id_notes); // Ensure your DB function handles the delete correctly
      
          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Note not found" });
          }
      
          res.status(200).json({ success: true, message: "Note deleted successfully" });
        } catch (error) {
          console.error("Error deleting note:", error);
          res.status(500).json({ success: false, message: "Failed to delete note" });
        }
      });
      

      notes.get('/getComments', async (req, res) => { // careful... you cant get req.body inside get parameter you need to add params
        const { id_classes } = req.query; // Get id_classes from query parameters
    
        try {
            const comments = await DB.getCommentsForClass(id_classes);
    
            if (comments.length === 0) {
                return res.status(404).json({ success: false, message: 'No comments found for this class' });
            }
    
            res.json({ success: true, comments });
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ success: false, message: 'Failed to retrieve comments' });
        }
    });

    notes.post('/addComment', async (req, res) => {
      const { id_classes, id_users, content } = req.body;
  
      try {
          const newComment = {
              id_classes,
              id_users,
              content
          };
  
          const result = await DB.addComment(newComment);
          res.status(201).json({ success: true, message: 'Comment added successfully!' });
      } catch (error) {
          console.error('Error adding comment:', error);
          res.status(500).json({ success: false, message: 'Failed to add comment' });
      }
  });
  


module.exports = notes;