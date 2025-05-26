import mongoose, { mongo } from "mongoose";
import { optionSchema } from "./option.model.js";
const pollSchema = new mongoose.Schema({
    title: {
        type: String, 
        require: true
    },
    // desc ko require
    description: {
        type: String,
    },
    options: [optionSchema],
    creator: Object,
    // status locked poll
    isLocked: {
        type: Boolean, 
        default: false
    },
    totalVotes: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
})

const Poll = mongoose.model("polls", pollSchema);
export default Poll;