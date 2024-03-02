const express = require('express');
const dotenv =require('dotenv').config();
const router = express.Router();
const mongoose = require('mongoose');
const saleModel = require('../saleModel');
// const { JWT_SECRET } = require('../../Config');
const Protective = require('../../Middle/Protective');




// Addsale entery

router.post("/api/addSale",Protective, async (req, res) => {
    try {
        console.log("this API is running");
        const { ProductName, Quantity, Amount } = req.body;

        if (!ProductName || !Quantity || !Amount) {
            return res.status(400).json({ error: "One or more mandatory fields are empty!" });
        }



        const postObj = new saleModel({
            ProductName: ProductName,
            Quantity: Quantity,
            Amount: Amount,

        });

        const newPost = await postObj.save();
        res.status(201).json({ Post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
//  totalRevenue
router.get('/api/todaysRevenue',Protective, async (req, res) => {
    try {
        const { userId } = req.params;
        // console.log('req.user._id', req.user._id);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        const todaySales = await saleModel.find({
            createdAt: {
                $gte: todayDate,
                $lt: new Date(todayDate.getTime() + 24 * 60 * 60 * 1000) // Fix the calculation for the next day
            }
        });

        console.log("Today's Sales for user:", todaySales);

        if (todaySales.length === 0) {
            res.status(401).json({
                message: "No sales recorded today for the user"
            });
        } else {
            const totalRevenue = todaySales.reduce((total, sale) => {
                return total + sale.Quantity * sale.Amount;
            }, 0);

            res.status(200).json({
                message: "Today's revenue has been fetched",
                totalRevenue,
                data: todaySales
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while calculating today's revenue" });
    }
});


// top five sale 
router.get("/api/topFiveSale",Protective, async (req, res) => {
    try {
        const topFiveSale = await saleModel.find({})
            .sort({ Amount: -1 })
            .limit(5);
            
       return res.status(200).json({ topFiveSale })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error!" })
    }
})
module.exports = router;