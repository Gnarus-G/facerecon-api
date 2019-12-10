const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: 123,
            name: "Joe",
            email: "john@gmail.com",
            // password: "cookies",
            passwordEnc: "$2a$10$UgAk98mZySWsZfo9RGYjVOizctiLAAPS7K5vcB4Ip0/UlFjfU2Unm",
            entries: 0,
            joined: new Date()
        },
        {
            id: "143",
            name: "Amy",
            email: "amy@gmail.com",
            // password: "love",
            passwordEnc: "$2a$10$gMZwt.cNo2qgpt8AJLUvCuTt24j/g513uHIPL5U/NGY7sXiWRl9jG",
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get("/", (req, res) => {
    res.send(database.users);
})

app.post("/signin", (req, res) => {
    console.log("request body:", req.body)
    if (req.body.email === database.users[0].email) {
        bcrypt.compare(req.body.password, database.users[0].passwordEnc).then(status => {
            console.log("password isLegit:", status);
            status ? res.json("Success signing in") : res.status(400).json("error logging in");
        }).catch(err => console.log('err', err));
    } else {
        res.status(400).json("error logging in");
    }
})

app.post("/register", (req, res) => {

    const { name, email, password } = req.body;

    bcrypt.hash(password, 10).then(hash => {
        database.users.push({
            id: "129",
            name: name,
            email: email,
            passwordEnc: hash,
            entries: 0,
            joined: new Date()
        })
        thisUser = database.users[database.users.length - 1];
        console.log("user, just registered:", thisUser);
        res.json(thisUser)
    }).catch(err => {console.log(err); res.json("Failure registering")});

    // res.json(database.users[database.users.length - 1]);
})

app.get("/profile/:id", (req, res) => {
    const id = req.params.id;
    let found = false;
    database.users.forEach(user => {
        found = true;
        if (user.id == id) return res.json(user);
    })
    if (!found) {
        res.status(404).json("no such user found")
    }
})

app.put("/image", (req, res) => {
    const id = req.body.id;
    let found = false;
    database.users.forEach(user => {
        found = true;
        if (user.id == id) return res.json(++user.entries);
    })
    if (!found) {
        // res.status(404).json("no such user found")
    }
})

app.listen(3333, () => {
    console.log("app is running on port 3333");
});