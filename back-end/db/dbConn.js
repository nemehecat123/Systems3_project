const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, 
    database: process.env.DB_DATABASE,
  })

 conn.connect((err) => {
      if(err){
          console.log("ERROR: " + err.message);
          return;    
      }
      console.log('Connection established');
    })


    let dataPool={}
  


dataPool.AuthUser=(username)=>
{
  return new Promise ((resolve, reject)=>{
    conn.query('SELECT * FROM users WHERE user_name = ?', username, (err,res, fields)=>{
      if(err){return reject(err)}
      return resolve(res)
    })
  })  
	
}

dataPool.AddUser=(username,email,password)=>{
  return new Promise ((resolve, reject)=>{
    conn.query(`INSERT INTO users (user_name,user_email,user_password) VALUES (?,?,?)`, [username, email, password], (err,res)=>{
      if(err){return reject(err)}
      return resolve(res)
    })
  })
}

dataPool.checkUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
      conn.query('SELECT * FROM users WHERE user_name = ?', [username], (err, results) => {
          if (err) return reject(err);
          resolve(results.length > 0);
      });
  }); 
};

dataPool.getAllClassesForUser = (userId) => {
  return new Promise((resolve, reject) => {
      conn.query('SELECT * FROM classes WHERE id_users = ?', [userId], (err, res) => {
          if (err) return reject(err);
          return resolve(res);
      });
  });
};

dataPool.getAllNotesForUser = (id_classes) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM notes WHERE id_classes = ?', [id_classes], (err, res) => {
        if (err) return reject(err);
        return resolve(res);
    });
});
};

dataPool.createNewClass = (newNote) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO classes (id_users, name_classes,teacher_name,  description , classes_year) VALUES (?, ?, ?, ?, ?)';
    const values = [newNote.id_users ,newNote.name, newNote.teacher, newNote.description,  newNote.yearOfClass, ];

    conn.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.createNewNoteWithImages = (newNote, images) => {
  return new Promise((resolve, reject) => {
    // Loop through each image and insert it as a new row in the `notes` table
    const insertImagePromises = images.map((image) => {
      return new Promise((imageResolve, imageReject) => {
        const query = `
          INSERT INTO notes (id_classes, Blob_Note, changed)
          VALUES (?, ?, NOW())
        `;
        const values = [
          newNote.id_classes,
          image, // Image blob data
        ];

        conn.query(query, values, (err, result) => {
          if (err) return imageReject(err);
          imageResolve(result);
        });
      });
    });

    // Wait for all image inserts to complete
    Promise.all(insertImagePromises)
      .then((results) => resolve({ success: true, noteCount: results.length }))
      .catch((err) => reject(err));
  });
};

dataPool.searchClassesByName = (name) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT classes.id_classes, classes.name_classes, classes.description, classes.teacher_name, users.user_name AS owner 
      FROM classes 
      JOIN users ON classes.id_users = users.id_users 
      WHERE classes.name_classes LIKE ?
    `;
    const searchTerm = `%${name}%`;
    conn.query(query, [searchTerm], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.deleteClass = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM classes WHERE id_classes = ?';
    conn.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.deleteNote = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM notes WHERE id_notes = ?';  // Adjust table name and field accordingly
    conn.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

dataPool.addComment = (newComment) => {
  return new Promise((resolve, reject) => {
      const query = 'INSERT INTO comments (id_classes, id_users, content,changed) VALUES (?, ?, ?, NOW())';
      const values = [newComment.id_classes, newComment.id_users, newComment.content];

      conn.query(query, values, (err, result) => {
          if (err) return reject(err);
          resolve(result);
      });
  });
};

dataPool.getCommentsForClass = (id_classes) => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM comments WHERE id_classes = ? ORDER BY changed DESC';
      conn.query(query, [id_classes], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
};

module.exports = dataPool;