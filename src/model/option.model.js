import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    votes: {
        type: Number, 
        require: true,
        default: 0
    },
    userVotes: Array, // lưu mảng các object id và username của người vote,
    pollID: {
        type: Number,
        require: true
    }
},
{
    timestamps: true
})

const Option = mongoose.Model("options", optionSchema);
export default Option;