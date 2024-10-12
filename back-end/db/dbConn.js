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
module.exports = dataPool;

