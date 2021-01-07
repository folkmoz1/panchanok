import dbConnect from "../../../../utils/dbConnect";
import Post from "../../../../models/Post";


export default async (req, res) => {
    await dbConnect()
    const {
        method,
        query: { postId },
    } = req

    switch (method) {
        case 'GET':
            try {
                const post = await Post.findById(postId).lean()

                res.status(200).json({success: true, data: post})
            } catch (e) {
                res.status(400).json({success: false})
            }
            break
    }
}
