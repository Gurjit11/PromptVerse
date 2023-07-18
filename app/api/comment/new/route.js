import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

export const POST = async (req, res) => {
    const { userId, promptId, message, parentId } = await req.json();

    try {
        await connectToDB();

        const newComment = new Comment({
            userId: userId,
            promptId: promptId,
            message: message,
            parentId: parentId,
        })

        await newComment.save()

        return new Response(JSON.stringify(newComment), { status: 201 })

    } catch (error) {
        console.log(error)
        return new Response('Failed to create a new Prompt', { status: 500 })
    }
}