import dbConnect from "../../../../../utils/dbConnect";
import Post from "../../../../../models/Post";
import jwt from "jsonwebtoken";
import {checkTokenVersion} from "../../../../../utils/Authenticate";
import Cookies from 'cookies'

export default async (req, res) => {
    const {
        method,
        query: { postId }
    } = req

    await dbConnect()
    const cookies = new Cookies(req, res)
    const token = cookies.get('tr')

    switch (method) {
        case 'GET':
            try {
                const post = await Post.findById(postId)

                res.status(200).json({success: true, data: post?.comments})
            } catch (e) {
                res.status(404).json({success: false})
                res.end()
            }
            break
        case 'POST':
            try {
                const { content, createdAt } = req.body
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
                        createdAt,
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
    }
}
