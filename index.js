const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require('morgan')
const Vote = require("./Models/Vote")
require("dotenv").config()


// midlewares
const app = express()
app.use(morgan('dev'))
app.use(cors())

// routes
app.post("/api/vote", async (req, res) => {
    try {
      const vote = await Vote.findOneAndUpdate(
        {},
        { $inc: { votes: 1 } }, 
        { new: true, upsert: true } 
      );
  
      res.status(200).json(vote);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
})

app.get("/api/", async (req, res) => {
    try {
      const vote = await Vote.findOne();
      if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
      }
      res.status(200).json(vote);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
})

// conennect and listen
const dbUrri = process.env.DB_URI
const port = process.env.PORT
mongoose.connect(dbUrri)
.then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`);
        
    })
})
.catch(err => {
    console.log(err);
})