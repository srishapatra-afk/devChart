import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Urgent", "Event", "General"],
        default: "General",
    },
    author: {
        type: String,
        required: true,
    },
    reactions: {
        type: Map,
        of: Number,
        default: {
            "👍": 0,
            "❤️": 0,
            "🎉": 0,
            "🚀": 0
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
