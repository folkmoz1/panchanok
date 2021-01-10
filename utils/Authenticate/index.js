import {sign, verify} from 'jsonwebtoken'
import User from "../../models/User";

const { TOKEN_SECRET } = process.env

export const generateAccessToken = user => {
    return sign({id: user._id, username: user.username}, TOKEN_SECRET,{expiresIn: '15m'})
}

export const generateRefreshToken = user => {
    return sign({id: user._id, username: user.username, version: user.tokenVersion}, TOKEN_SECRET,{expiresIn: '15d'})
}

export const verifyAccessToken = token => {
    return verify(token, TOKEN_SECRET,{ignoreExpiration: true})
}

export const verifyRefreshToken = token => {
    return verify(token, TOKEN_SECRET)
}

export const getUserJSON = user => {
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

    return userJSON
}

export const checkTokenVersion = async (id, tokenVersion) => {
    const user = await User.findById(id)

    if (!user) return false


    return {
        valid: tokenVersion == user.tokenVersion,
        user
    }

}

