import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    promptId: {
        type: Schema.Types.ObjectId,
        ref: 'Prompt',
    },
    message: {
        type: String,
        required: [true, 'message is required!'],
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
}, { timestamps: { createdAt: 'createdAt' } });

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;