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

                res.status(200).json({success: true, data: post})
            } catch (e) {
                res.status(404).json({success: false})
            }
            break
        case 'PUT' :
            try {
                const { content } = req.body
                jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const { sub, email, version } = result

                    const { user, valid } = await checkTokenVersion(sub, version)

                    if (!valid) throw new Error()

                    const post = await Post.findById(postId)

                    const { comments } = post

                    const data = {
                        owner: user._id.toString(),
                        fullName: `${user.firstName} ${user.lastName}`,
                        username: user.username,
                        content,
                        createdAt: Date.now(),
                        profile: user.image
                    }

                    await post.updateOne({
                        comments: [...comments, data]
                    })

                    res.status(200).json({success: true})
                })
            } catch (e) {
                res.status(400).json({success: false})
                res.end()
            }
            break
        case 'DELETE':
            try {
                jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const { sub, email, version } = result

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

                    res.status(201).json({success: true})
                })


                res.status(200).json({success: true})
            } catch (e) {
                res.status(404).json({success: false})
            }
            break
    }
}
