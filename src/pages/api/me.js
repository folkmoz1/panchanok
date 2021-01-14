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

        try {
            jwt.verify(cookie, process.env.TOKEN_SECRET, {}, async (err, result) => {
                if (err) throw new Error()

                const {sub, version} = result

                const {user, valid} = await checkTokenVersion(sub, version)

                if (!valid) throw new Error('token is valid')


                res.status(200).json({success: true, userJSON: getUserJSON(user)})
            })
        } catch (e) {
            cookies.set('tr--')
            cookies.set('ta--')
            res.status(401).json({success: false})
            res.end()
        }

}
