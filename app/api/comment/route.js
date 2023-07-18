import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

export const GET = async (req, res) => {
    try {
        await connectToDB();

        const comments = await Comment.find({}).populate('userId')

        return new Response(JSON.stringify(comments), { status: 200 })
    } catch (error) {
        return new Response('Failed to get Prompts', { status: 500 })
    }
}