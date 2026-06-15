import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET() {
    try {
        await connectDB();
        const members = await Member.find().sort({ name: 1 });
        return Response.json(members);
    } catch (error) {
        console.error("Error fetching members:", error);
        return Response.json(
            { message: "Failed to fetch members" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // Generate a random pleasant color for initials avatar if not provided
        if (!body.avatarColor) {
            const colors = [
                "#3B82F6", // Blue
                "#10B981", // Emerald
                "#F59E0B", // Amber
                "#EF4444", // Red
                "#8B5CF6", // Violet
                "#EC4899", // Pink
                "#06B6D4", // Cyan
                "#F97316", // Orange
            ];
            body.avatarColor = colors[Math.floor(Math.random() * colors.length)];
        }

        const member = await Member.create(body);
        return Response.json(member, { status: 201 });
    } catch (error) {
        console.error("Error creating member:", error);
        return Response.json(
            { message: "Failed to create member" },
            { status: 500 }
        );
    }
}
