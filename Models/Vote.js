const mongoose = require("mongoose")
const Schema = mongoose.Schema

const VoteSchema = new Schema({
    votes: {
        type: Number,
        default: 0
    }
})

const Vote = mongoose.model('Vote', VoteSchema)
module.exports = Vote