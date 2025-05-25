import mongoose, { mongo } from "mongoose";

const pollSchema = new mongoose.Schema({
    title: {
        type: String, 
        require: true
    },
    // desc ko require
    description: {
        type: String,
    },
    options: Array,
    creator: Object,
    // status locked poll
    isLocked: {
        type: Boolean, 
        require: true
    },
    totalVotes: {
        type: Number,
        require: true
    }
},
{
    timestamps: true
})

const Poll = mongoose.model("polls", pollSchema);
export default Poll;