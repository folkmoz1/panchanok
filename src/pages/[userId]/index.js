import axios from "axios";
import useSWR from "swr";
import {useRouter} from "next/router";
import {useEffect} from "react";


const UserProfile = ({ user:initial }) => {
    const { query: { userId } } = useRouter()

    const { data: user } = useSWR(`/api/users/${userId.slice(1)}`,{
        initialData: initial,
        onSuccess: data => console.log(data)
    })

    useEffect(() => {
        console.log(userId)
    },[userId])

    if (!user) {
        return <h1>loading</h1>
    }

    return (
        <>
            <div>
                get user
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

            if (!success) throw new Error('ไม่เจอผู้ใช้งานนี้')

            return {user}

        } catch (e) {
            console.log(e.message)
            return {user: null}

        }
    }

    return {user: null}

}

export default UserProfile
