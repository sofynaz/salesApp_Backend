const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require('../Config');
const mongoose = require("mongoose");
const UserModel = require('../Model/UserModel')
const dotenv = require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
   
    if (!authorization) {
        return res.status(401).json({ error: "User not login!" })
    }


    const token = authorization.split(" ")[1]
    console.log(token);   /// ask========================
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        // console.log(JWT_SECRET);
        if (error) {
            return res.status(401).json({ error: "User not login!" })
        }
        const { _id } = payload;
        UserModel.findById(_id)
            .then((dbUser) => {
                req.user = dbUser;
                next()

            })
    })

}