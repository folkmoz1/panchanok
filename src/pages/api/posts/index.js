import dbConnect from "../../../../utils/dbConnect";
import Post from "../../../../models/Post";

export default async (req, res) => {
    const { method } = req
    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                const posts = await Post.find({})

                res.status(200).json({success: true, data: posts})
            } catch (e) {
                res.status(400).json({ success: false })
            }
            break
        case 'POST':
            try {

                const { author, desc, images, title } = JSON.parse(req.body)

                const newPost = await Post.create({
                    author,
                    title,
                    desc,
                    images,
                    createdAt: Date.now()
                })

                await newPost.save()

                res.status(201).json({success: true})
            } catch (e) {
                res.status(400).json({success: false})
            }
            break
        default:
            res.status(400)
    }
}
