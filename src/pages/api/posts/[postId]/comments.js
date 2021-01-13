import dbConnect from "../../../../../utils/dbConnect";
import Post from "../../../../../models/Post";


export default async (req, res) => {
    const {
        method,
        query: { postId }
    } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const post = await Post.findById(postId)

                res.status(200).json({success: true, data: post?.comments})
            } catch (e) {
                res.status(404).json({success: false})
                res.end()
            }
    }
}
