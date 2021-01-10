import dbConnect from "../../../../utils/dbConnect";
import bcrypt from 'bcrypt'
import Cookie from 'cookies'
import User from "../../../../models/User";
import {getUserJSON} from "../../../../utils/Authenticate";
import jwt from "jsonwebtoken";


export default async (req, res) => {
    const { method } = req
    await dbConnect()

    if (method === 'POST') {
        try {
            const cookie = new Cookie(req, res)

            const { username, email, password, firstName, lastName } = req.body

            const user = await User.findOne({email})

            if (user) throw new Error('Email is already in use')

            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                createdAt: Date.now()
            })

            const payload = { sub: newUser?._id, email: newUser?.email }

            const acToken = jwt.sign(payload, process.env.TOKEN_SECRET,{ expiresIn: '15m'})
            const rfToken = jwt.sign({...payload, version: newUser?.tokenVersion}, process.env.TOKEN_SECRET,{ expiresIn: '15d'})

            cookie.set('tr--', rfToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 15,
                path: '/'
            })

            cookie.set('ta--', acToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 3600,
                path: '/'
            })

            await newUser.save()


            res.status(201).json({success: true, user: getUserJSON(newUser)})

        } catch (err) {
            res.status(400).json({success: false, message: err.message})

        }
    }
}
