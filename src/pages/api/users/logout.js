import dbConnect from "../../../../utils/dbConnect";
import {checkTokenVersion, verifyRefreshToken} from "../../../../utils/Authenticate";
import Cookies from 'cookies'

export default async (req, res) => {
    const {
        method,
        headers: { uid, cookie }
    } = req

    await dbConnect()

    const Cookie = new Cookies(req, res)

    if (method === 'POST') {
        try {
            const token = cookie.split('=')[1]

            const { sub, email, version } = verifyRefreshToken(token)

            const { user, valid } = await checkTokenVersion(sub, version)

            if (!valid) throw new Error()

            await user.updateOne({
                tokenVersion: user?.tokenVersion + 1
            },{ new: true })

            await user.save()

            Cookie.set('tr--')
            Cookie.set('ta--')

            res.status(200).json({success: true})

        } catch (e) {
            res.status(401)
            res.end()
        }
    }
}
