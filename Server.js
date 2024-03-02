const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const {MONGO_DB_URL} =require('./Config')
const dotenv = require('dotenv').config();
console.log(MONGO_DB_URL);


app.use(require('./Model/Route/UserRoute'));
app.use(require('./Model/Route/saleRoute'));

mongoose.connect(process.env.MONGO_DB_URL)
.then(()=>{
    console.log("Database connected!");
    app.listen(8080,()=>{
        console.log("Server has started !");
    })
})
.catch((err)=>{
    console.log(err);
})
