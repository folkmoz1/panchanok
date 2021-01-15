import jwt from "jsonwebtoken";
import {checkTokenVersion, getUserJSON} from "../../../utils/Authenticate";
import dbConnect from "../../../utils/dbConnect";
import Cookies from "cookies";


export default async (req, res) => {
    await dbConnect()
    const cookies = new Cookies(req, res)

    const {
        method,
        query: { userId },
        headers: { cookie }
    } = req

        if (method === 'POST') {
            try {
                const {sub, version } = jwt.verify(cookie, process.env.TOKEN_SECRET)

                const {user, valid} = await checkTokenVersion(sub, version)

                if (!valid) throw new Error('token is valid')


                res.status(200).json({success: true, userJSON: getUserJSON(user)})
            } catch (e) {
                res.status(401).json({success: false, message: 'Not Authenticate'})
                res.end()
            }
        } else {
            res.status(404).json({success: false, message: 'Not Authenticate'})

        }

}
