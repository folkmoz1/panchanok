import dbConnect from "../../../../utils/dbConnect";
import Post from "../../../../models/Post";
import { deleteImage } from '../../../../utils/cloudinary'

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
                res.status(404).json({success: false})
            }
            break
        case 'DELETE':
            try {
                const post = await Post.findById(postId)

                const { images } = post

                await images.map(img => deleteImage(img.public_id))

                await post.deleteOne()

                res.status(200).json({success: true})
            } catch (e) {
                res.status(404).json({success: false})
            }
    }
}
