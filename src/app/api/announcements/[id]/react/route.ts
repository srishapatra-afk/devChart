import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

type Params = {
    params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: Params) {
    try {
        await connectDB();
        const { id } = await params;
        const { emoji } = await request.json();

        if (!emoji) {
            return Response.json({ message: "Emoji is required" }, { status: 400 });
        }

        // Atomically increment the emoji reaction count
        const announcement = await Announcement.findByIdAndUpdate(
            id,
            { $inc: { [`reactions.${emoji}`]: 1 } },
            { new: true }
        );

        if (!announcement) {
            return Response.json({ message: "Announcement not found" }, { status: 404 });
        }

        return Response.json(announcement);
    } catch (error) {
        console.error("Error updating reaction:", error);
        return Response.json({ message: "Failed to update reaction" }, { status: 500 });
    }
}
