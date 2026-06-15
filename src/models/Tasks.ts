import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    status: {
        type: String,
        enum: ["todo", "in_progress", "done"],
        default: "todo",
    },
    tag: {
        type: String,
        enum: ["Development", "Design", "Marketing", "Logistics", "General"],
        default: "General",
    },
    assignedTo: {
        type: String,
        default: "",
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;