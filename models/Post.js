import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    author: {
        type: Object,
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
    action: {
        type: Array
    },
    comment: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Number,
    }
},{
    strict: false,
    versionKey: false
})


export default mongoose.models.Post || mongoose.model('Post', PostSchema)
