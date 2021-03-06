import dbConnect from "../../../../utils/dbConnect";
import Post from "../../../../models/Post";
import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import {checkTokenVersion} from "../../../../utils/Authenticate";

export default async (req, res) => {
    const { method } = req
    await dbConnect()
    const cookies = new Cookies(req, res)

    const token = cookies.get('tr')


    switch (method) {
        case 'GET':
            try {
                const posts = await Post.find({}).sort({createdAt: 'desc'})

                posts.map(post => {
                    post.comments = null
                    post.actions = null
                    post.images =
                        post.images.filter((img, index) => index === 0)

                    return post
                })

                res.status(200).json({success: true, data: posts})
            } catch (e) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {

                jwt.verify(token, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const { sub, email, version } = result

                    const { user, valid } = await checkTokenVersion(sub, version)

                    if (!valid) throw new Error()

                    req.body.author = {
                        id: user._id.toString(),
                        username: user.username,
                        fullName: `${user.firstName} ${user.lastName}`,
                        profile: user.image
                    }

                    req.body.createdAt = Date.now()

                    const newPost = await Post.create(req.body)

                    req.body.id = newPost._id.toString()

                    delete req.body.author

                    await user.updateOne({
                        posts: [...user.posts, req.body]
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
        default:
            res.status(400)
    }
}
