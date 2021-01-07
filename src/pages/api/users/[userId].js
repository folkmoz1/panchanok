import jwt from "jsonwebtoken";
import Cookies from 'cookies'
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";


export default async (req, res) => {
    await dbConnect()


    const {
        method,
        query: { userId },
        headers: { cookie }
    } = req

    if (method === 'POST' && cookie) {

        try {
            jwt.verify(cookie, process.env.TOKEN_SECRET,{}, async (err, result) => {
                if (err) throw new Error()

                const user = await User.findById(userId)

                const userJSON = {
                    id: user?._id,
                    username: user?.username,
                    email: user?.email,
                    createdAt: user?.createdAt,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    image: user?.image,
                    emailVerified: user?.emailVerified
                }

                res.status(200).json({success: true, userJSON})
            })
        } catch (e) {
            res.status(401).json({success: false})
            res.end()
        }
    } else {
        res.status(500)
        res.end()
    }
}
