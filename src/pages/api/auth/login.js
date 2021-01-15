import dbConnect from "../../../../utils/dbConnect";
import bcrypt from 'bcrypt'
import Cookies from 'cookies'
import User from "../../../../models/User";
import { getUserJSON } from "../../../../utils/Authenticate";
import jwt from 'jsonwebtoken'


export default async (req, res) => {
    const { method } = req
    await dbConnect()

    if (method === 'POST') {
        try {
            const cookie = new Cookies(req, res)

            const { userOrEmail, password } = JSON.parse(req.body)

            const user = await User.findOne({'$or': [{username: userOrEmail}, {email: userOrEmail}]})

            if (!user) throw new Error('ไม่พบชื่อผู้ใช้นี้ โปรดลองอีกครั้ง')

            const doMatch = await bcrypt.compare(password, user?.password)

            if (!doMatch) throw new Error('รหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง')

            const payload = { sub: user?._id, email: user?.email }

            const acToken = jwt.sign(payload, process.env.TOKEN_SECRET,{ expiresIn: '15m'})
            const rfToken = jwt.sign({...payload, version: user?.tokenVersion}, process.env.TOKEN_SECRET,{ expiresIn: '15d'})

            cookie.set('tr', rfToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                path: '/'
            })

            cookie.set('ta', acToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                path: '/'
            })



            res.status(200).json({success: true, user: getUserJSON(user)})

        } catch (err) {
            res.status(401).json({success: false, message: err.message})
        }
    }
}
