const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const morgan = require('morgan')
const Vote = require("./Models/Vote")
const axios = require('axios')
require("dotenv").config()


// keep the server awake
const keepServerAwake = () => {
  const serverUrl = `http://localhost:${port}`; 
  setInterval(async () => {
    try {
      console.log(`keep the server awake ${serverUrl}`);
      await axios.get(serverUrl);
    } catch (error) {
      console.error('Error while keeping the srever awake!', error.message);
    }
  }, 5 * 60 * 1000);
};


// midlewares
const app = express()
app.use(morgan('dev'))
app.use(cors())

// routes
app.get('/', (req, res) => {
  res.send("hello :)")
})

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
        keepServerAwake();
    })
})
.catch(err => {
    console.log(err);
})
