import dbConnect from "../../../../../utils/dbConnect";
import Post from "../../../../../models/Post";
import Cookies from 'cookies'
import jwt from "jsonwebtoken";
import {checkTokenVersion} from "../../../../../utils/Authenticate";

export default async (req, res) => {
    const {
        method,
        query: { postId }
    } = req
    await dbConnect()
    const cookies = new Cookies(req, res)
    const token = cookies.get('tr--')

    switch (method) {
        case 'GET':
            try {
                const post = await Post.findById(postId)

                res.status(200).json({success: true, data: post?.actions || []})
            } catch (e) {
                res.status(404).json({success: false})
                res.end()
            }
            break
        case 'POST':
            try {
                jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const { sub, email, version } = result

                    const { user, valid } = await checkTokenVersion(sub, version)

                    if (!valid) throw new Error()

                    const post = await Post.findById(postId)

                    const { actions } = post

                    const data = {
                        owner: user._id.toString(),
                        fullName: `${user.firstName} ${user.lastName}`,
                        username: user.username,
                        profile: user.image
                    }

                    await post.updateOne({
                        actions: [...actions, data]
                    },{
                        new: true,
                        strict: false,
                    })

                    res.status(201).json({success: true})
                })
            } catch (e) {
                res.status(401).json({success: false})
            }
            break
        case 'PUT':
            try {
                jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const { sub, email, version } = result

                    const { user, valid } = await checkTokenVersion(sub, version)

                    if (!valid) throw new Error()

                    const post = await Post.findById(postId)

                    const { actions } = post

                    const newActions = actions.filter(i => i.owner !== user._id.toString())

                    await post.updateOne({
                        actions: newActions
                    },{
                        new: true,
                        strict: false,
                    })

                    res.status(200).json({success: true})
                })
            } catch (e) {
                res.status(401).json({success: false})
            }
            break
    }
}
