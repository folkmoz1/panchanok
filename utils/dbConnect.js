import mongoose from 'mongoose'

const connection = {}

async function dbConnect() {
    if (connection.isConnect) {
        console.log('db already to use.')
        return
    }

    const db = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })


    console.log('db is connected')

    connection.isConnect = db.connections[0].readyState
}

export default dbConnect
