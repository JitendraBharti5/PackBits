import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: { 
        type: Number,
        required: true 
    },
    allergies: { 
        type: [String], 
        default: [] 
    },
    preconditions: { 
        type: [String], 
        default: [] 
    },
    vegNonVeg: {
        type: String,
        enum: ["veg", "nonveg"],
        required: true,
    }
});

const User = mongoose.model("User", userSchema);
export default User;
