import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the Post document
interface IPost extends Document {
    title: string;
    author: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    createdAt: Date;
}

// Create the Post schema
const postSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Post model
const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;