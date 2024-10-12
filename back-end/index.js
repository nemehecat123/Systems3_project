const express = require('express')
const session = require('express-session')
const cors=require("cors")
const cookieParser = require("cookie-parser");


require('dotenv').config()
const app = express()
const port = process.env.PORT || 8205







app.use(cookieParser());

// Configuration if we had cross origin enabled.
// let sess = {
//     secret: 'our litle secret',
//     resave: false,
//     proxy: true,
//     saveUninitialized: true,
//     cookie: {
//         secure: true,
//         sameSite: 'none'
//     }
// }

let sess = {
    secret: 'yourSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,  // This disables the 'Secure' flag for local development
        httpOnly: true,
        sameSite: 'None',  // Allow cross-origin cookies
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }
};
// let sess = {
//     secret: 'our litle secret',
//     saveUninitialized: true,
//     resave: false,
//     proxy: true,
//     name:"app",
//     cookie: {
//         httpOnly: true,
//     }
// }

app.use(session(sess))

//Some configurations
app.use(express.urlencoded({extended : true}));
app.use(cors({
 methods:["GET", "POST"],
  credentials: true, 
  origin: ['http://localhost:3000','http://localhost:3001']
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const novice = require('./routes/novice')
const users = require('./routes/users')
const upload = require('./routes/upload')
const notes = require('./routes/notes')


app.use('/novice', novice)
app.use('/users', users)
app.use('/uploadFile', upload)
app.use('/notes', notes)


const path = require('path')
console.log(__dirname)
app.use(express.static(path.join(__dirname, "build")))
app.use(express.static(path.join(__dirname, "uploads")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html")) 
})

app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false, user: null });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
