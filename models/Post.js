import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, 'author is required.']
    },
    title: {
        type: String,
        required: [true, 'title is required.']
    },
    images: {
        type: Array,
        required: [true, 'image is required.']
    },
    desc: {
        type: String,
    },
    like_count: {
        type: Number
    },
    comment: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Number,
    }
})


export default mongoose.models.Post || mongoose.model('Post', PostSchema)
