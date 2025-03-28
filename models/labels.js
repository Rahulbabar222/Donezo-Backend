import mongoose from "mongoose";

const labelSchema = new mongoose.Schema({
    label:String
});

export const Labels = mongoose.model("Labels", labelSchema);