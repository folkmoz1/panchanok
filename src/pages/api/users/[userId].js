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

                res.status(200).json({success: true, data: getUserJSON(user)})
            } catch (e) {
                res.status(404).json({success: false, data: null})
                res.end()
            }
            break


    }
}
