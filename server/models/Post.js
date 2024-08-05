import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;