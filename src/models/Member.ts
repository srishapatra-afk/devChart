import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: "",
    },
    department: {
        type: String,
        enum: ["Management", "Development", "Design", "Marketing", "Operations"],
        default: "Development",
    },
    avatarColor: {
        type: String,
        default: "#06B6D4", // Teal color default
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Member = mongoose.models.Member || mongoose.model("Member", MemberSchema);

export default Member;
