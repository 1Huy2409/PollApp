import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        require: true
    },
    age: {
        type: Number, 
        require: true,
    },
    email: {
        type: String, 
        require: true,
        unique: true
    },
    username: {
        type: String, 
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String, 
        default: "user",
        require: true
    }
    // reset password để sau
},
{
    timestamps: true
})

const User = mongoose.model("users", userSchema);
export default User;