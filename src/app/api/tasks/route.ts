import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export async function GET(){
    try{
        await connectDB();

        const tasks = await Task.find();

        return Response.json(tasks);

    }catch(error){

        console.log(error);

        return Response.json(
            {message:"Failed to fetch tasks"},
            {status: 500}
        );
    }
}

export async function POST(request: Request){
    try{
        await connectDB();

        const body = await request.json();
        
        // Synchronize completed field with status
        if (body.status) {
            body.completed = body.status === "done";
        } else if (body.completed !== undefined) {
            body.status = body.completed ? "done" : "todo";
        }

        const task = await Task.create(body);

        return Response.json(task,{status: 201});
    }catch(error){
        console.log(error);
        return Response.json(
            {message:"Failed to create task"},
            {status: 500}
        );
    }
}