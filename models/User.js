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
    lastName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Number,
        required: true
    },
    image: {
        type: String
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
})

export default mongoose.models.User || mongoose.model('User', userSchema)




