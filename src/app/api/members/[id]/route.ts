import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";

type Params = {
    params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: Params) {
    try {
        await connectDB();
        const { id } = await params;

        const member = await Member.findByIdAndDelete(id);

        if (!member) {
            return Response.json({ message: "Member not found" }, { status: 404 });
        }

        return Response.json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error("Error deleting member:", error);
        return Response.json({ message: "Failed to delete member" }, { status: 500 });
    }
}
