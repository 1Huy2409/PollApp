import mongoose, { mongo } from "mongoose";

const voteSchema = new mongoose.Schema({
    // vote id auto generate
    userId: {
        type: String, 
        require: true
    },
    pollId: {
        type: String, 
        require: true
    },
    optionId: {
        type: String, 
        require: true
    }
})
voteSchema.index({ userId: 1, pollId: 1 }, { unique: true });
const Vote = mongoose.model("votes", voteSchema);
export default Vote;