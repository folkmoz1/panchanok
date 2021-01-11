import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    posts: {
        type: Array,
    },
    lastName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: '/images/svg/svg--avatar.svg'
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    tokenVersion: {
        type: Number,
        default: 0
    }
},{
    strict: false,
    versionKey: false
})

export default mongoose.models.User || mongoose.model('User', userSchema)




