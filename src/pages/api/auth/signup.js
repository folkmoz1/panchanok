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
            const { username, email, password, firstName, lastName, } = req.body

            const user = await User.findOne({email})

            if (user) throw new Error('Email is already in use')

            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                createAt: Date.now()
            })

            await newUser.save()

            return newUser

        } catch (err) {
            throw err
        }
    }
}
