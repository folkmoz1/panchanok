import Router from "next/router";
import axios from "axios";


const UserProfile = ({ }) => {

    return (
        <>
            <div>

            </div>
        </>
    )
}

UserProfile.getInitialProps = async ({ req, res, query: {userId} }) => {
    const username = userId.slice(1)


    if (req) {
        try {
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/users/${username}`)

            const {user, success} = resp.data

            if (!success) throw new Error()

            return {user}

        } catch (e) {
            console.log(e)
        }
    } else {
        return {user: null}
    }


}

export default UserProfile
