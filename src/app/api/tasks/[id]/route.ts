import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

type Params = {
    params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: Params) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        // If status is "done", set completed to true, otherwise false
        if (body.status) {
            body.completed = body.status === "done";
        } else if (body.completed !== undefined) {
            body.status = body.completed ? "done" : "todo";
        }

        const task = await Task.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!task) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }

        return Response.json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        return Response.json({ message: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        await connectDB();
        const { id } = await params;

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return Response.json({ message: "Task not found" }, { status: 404 });
        }

        return Response.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error deleting task:", error);
        return Response.json({ message: "Failed to delete task" }, { status: 500 });
    }
}
