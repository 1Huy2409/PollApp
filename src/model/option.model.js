import mongoose, { mongo } from "mongoose";

export const optionSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
    text: {
        type: String,
        require: true
    },
    votes: {
        type: Number,
        default: 0
    },
    userVotes: {
        type: Array,
        default: []
    }
})
