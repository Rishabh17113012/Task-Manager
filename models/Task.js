import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "10.00 AM - 5.30 PM",
    },
    status: {
        type: String,
        default: "Under-Review",
    },
});


export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
