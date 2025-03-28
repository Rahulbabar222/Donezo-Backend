import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    todo: String,
    isCompleted: Boolean,
    label:String,
    createdAt: { type: Date, default: Date.now },
    reminder: {type: Date}
});

export const Todo = mongoose.model("Todo", todoSchema);