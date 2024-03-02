const express = require('express');
const router = express.Router();
const bcryptjs = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const UserModel = require('../UserModel');
const dotenv =require('dotenv').config();
// const { JWT_SECRET } = require('../../Config')


// Registration
router.post("/api/auth/Register", (req, res) => {
    console.log('This API is runnong!');
    const { FullName, LastName, Email, Password } = req.body;

    if (!FullName || !LastName || !Password || !Email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }

    UserModel.findOne({ Email: Email })
        .then((userInDB) => {
            if (userInDB) {
                return res.status(500).json({ error: "User with this email already registered" });
            }

            bcryptjs.hash(Password, 16)
                .then((hashedpassword) => {
                    const user = new UserModel({ FullName, LastName, Email, Password: hashedpassword });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: "User signed up successfully!" });
                        })
                        .catch((err) => {
                            console.error(err);
                            res.status(500).json({ error: "Internal Server Error" });
                        });
                })
                .catch((hashError) => {
                    console.error(hashError);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

//Login Page code
router.post("/api/auth/Login", (req, res) => {
    console.log("this Api is running");
    const { Email, Password } = req.body;

    if (!Password || !Email) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }

    UserModel.findOne({ Email: Email })
        .then((userInDB) => {
            if (!userInDB) {

                return res.status(401).json({ error: "Invalid Credential" });
            }

            bcryptjs.compare(Password, userInDB.Password)
                .then((didMatched) => {
                    console.log(process.env.JWT_SECRET);
                    if (didMatched) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, process.env.JWT_SECRET);
                        const userInfo = { "Email": userInDB.Email }

                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });


                        // res.status(200).json({ result: "User Login up successfully!" });
                    } else {
                        return res.status(401).json({ error: "Invalid Credential" });
                    }

                })
                .catch((hashError) => {
                    console.error(hashError);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

module.exports = router;