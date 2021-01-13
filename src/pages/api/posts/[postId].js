import dbConnect from "../../../../utils/dbConnect";
import Post from "../../../../models/Post";
import { deleteImage } from '../../../../utils/cloudinary'
import Cookies from 'cookies'
import jwt from "jsonwebtoken";
import {checkTokenVersion} from "../../../../utils/Authenticate";

export default async (req, res) => {
    await dbConnect()
    const {
        method,
        query: { postId },
    } = req

    const cookies = new Cookies(req, res)

    const token = cookies.get('tr--')

    switch (method) {
        case 'GET':
            try {
                const post = await Post.findById(postId).lean()

                post.comments = post.comments.length

                post.actions = post.actions.length

                res.status(200).json({success: true, data: post})
            } catch (e) {
                res.status(404).json({success: false})
            }
            break
        case 'PUT' :
            try {

            } catch (e) {
                res.status(404)
                res.end()
            }
        case 'DELETE':
            try {
                jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const { sub, version } = result

                    const { user, valid } = await checkTokenVersion(sub, version)

                    if (!valid) throw new Error()

                    const post = await Post.findById(postId)

                    const { _id: userId, posts } = user

                    if (userId.toString() !== post?.author.id) throw new Error()

                    const { images } = post

                    await images.map(img => deleteImage(img.public_id))

                    await post.deleteOne()

                    await user.updateOne({
                        posts: posts.filter(post => post.id !== postId)
                    },{
                        new: true,
                        strict: false,
                    })

                    res.status(200).json({success: true})
                })
            } catch (e) {
                res.status(404).json({success: false})
            }
            break
    }
}
