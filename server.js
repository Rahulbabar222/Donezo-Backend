import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import bodyParser from "body-parser";
import { Todo } from "./models/todo.js";
import { Labels } from "./models/labels.js";
import { startReminderService } from "./reminder.js";
const app = express()
const port = 3001

app.use(cors());
app.use(bodyParser.json());

startReminderService()

mongoose.connect("mongodb://127.0.0.1:27017/DonezoDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/todos", async (req, res) => {
    const { todo,label,reminder } = req.body;
    const newTodo = new Todo({ todo, isCompleted:false, label,createdAt: new Date(),reminder });

    try {
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: "Error saving todo" });
    }
});

app.get("/labels", async (req, res) => {
    const labels = await Labels.find();
    res.json(labels);
});

app.post("/labels", async (req, res) => {
    const { label } = req.body;
    const newLabel = new Labels({label});
    try {
        await newLabel.save();
        res.status(201).json(newLabel);
    } catch (error) {
        res.status(500).json({ message: "Error saving new Label" });
    }
});

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { todo,label } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { todo,label},
            { new: true }  // ✅ Fix: This ensures the updated document is returned
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error });
    }
});


app.patch("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { isCompleted },
            { new: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error updating todo" });
    }
});

app.put("/todos", async (req, res) => {
    try {
        
        const { todos } = req.body;

        if (!todos || !Array.isArray(todos)) {
            return res.status(400).json({ message: "Invalid todos data. Expected an array." });
        }

       for (let todo of todos){
        await Todo.updateOne(
            { _id: todo._id }, 
            { $set: { label: todo.label } } 
        );
       }
       res.json({ message: "Todos updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating label" });
    }
});

app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Todo.findByIdAndDelete(id);
      res.json({ message: "Todo deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting todo" });
    }
  });


  app.delete("/labels/:id", async (req, res) => {
    const { id } = req.params;
    console.log("Received DELETE request for ID:", id);

    try {
        await Labels.findByIdAndDelete(id);
        res.json({ message: "Label deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting label", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
