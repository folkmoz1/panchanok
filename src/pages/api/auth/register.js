import dbConnect from "../../../../utils/dbConnect";
import bcrypt from 'bcrypt'
import cookie from 'cookie'
import User from "../../../../models/User";


export default async (req, res) => {
    const { method } = req
    await dbConnect()

    if (method === 'POST') {
        try {
            const { username, email, password, firstName, lastName } = req.body

            console.log(req.body)

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

            await newUser.save()

            res.status(201).json({success: true})

        } catch (err) {
            res.status(400).json({success: false, message: err.message})

        }
    }
}
