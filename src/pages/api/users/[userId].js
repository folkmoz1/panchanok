import jwt from "jsonwebtoken";
import Cookies from 'cookies'
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";
import {checkTokenVersion, getUserJSON} from "../../../../utils/Authenticate";

export default async (req, res) => {
    await dbConnect()
    const cookies = new Cookies(req, res)

    const {
        method,
        query: { userId },
        headers: { cookie }
    } = req

    switch (method) {
        case 'GET':
            try {
                const user = await User.findOne({username: userId})

                res.status(200).json({success: true, user: getUserJSON(user)})
            } catch (e) {
                res.status(404).json({success: false})
            }
            break
        case 'POST':
            try {
                jwt.verify(cookie, process.env.TOKEN_SECRET, {}, async (err, result) => {
                    if (err) throw new Error()

                    const {sub, version} = result

                    const {user, valid} = await checkTokenVersion(sub, version)

                    if (!valid) throw new Error('token is valid')

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
                cookies.set('tr--')
                cookies.set('ta--')
                res.status(401).json({success: false})
                res.end()
            }
            break

    }
}
