import dbConnect from "../../../../utils/dbConnect";
import bcrypt from 'bcrypt'
import cookie from 'cookie'
import User from "../../../../models/User";
import jwt from 'jsonwebtoken'


export default async (req, res) => {
    const { method } = req
    await dbConnect()

    if (method === 'POST') {
        try {
            const { userOrEmail, password } = req.body

            const user = await User.findOne({'$or': [{username: userOrEmail}, {email: userOrEmail}]})

            if (!user) throw new Error('ไม่พบชื่อผู้ใช้นี้ โปรดลองอีกครั้ง')

            const doMatch = await bcrypt.compare(password, user?.password)

            if (!doMatch) throw new Error('รหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง')

            const payload = { sub: user?._id, email: user?.email }

            const acToken = jwt.sign(payload, process.env.TOKEN_SECRET,{ expiresIn: '15m'})
            const rfToken = jwt.sign(payload, process.env.TOKEN_SECRET,{ expiresIn: '15d'})

            res.setHeader('Set-Cookie', cookie.serialize('ta--', acToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 60 * 15,
                path: '/'
            }))

            res.setHeader('Set-Cookie', cookie.serialize('tr--', rfToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 15,
                path: '/'
            }))

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

        } catch (err) {
            res.status(401).json({success: false, message: err.message})
        }
    }
}
