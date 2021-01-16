import axios from "axios";
import useSWR from "swr";
import {useRouter} from "next/router";
import _ from 'lodash'
import Image from "next/image";
import {CakeRounded, EmailRounded} from "@material-ui/icons";
import { dayjs } from '../../../utils/dayjs'
import Card__Component from "../../components/Card";

const UserProfile = ({ user:initial }) => {
    const { query: { userId } } = useRouter()

    const { data: user } = useSWR(`/api/users/${userId.slice(1)}`,{
        initialData: initial
    })



    if (!user) {
        return <h1>loading</h1>
    }

    if (_.isEmpty(user)) {
        return <h1>User not found</h1>
    }


    return (
        <>
            <div className={'max-w-screen-2xl flex md:pt-20 mx-auto'}>
                <div className="w-7/12">
                    <div className={"w-full"}>
                        {
                            _.map(user.posts, post => (
                                <>

                                </>
                            ))
                        }
                    </div>
                </div>
                <div className={"w-5/12"}>
                    <div className="w-full md:pr-8">
                        <div className={"ml-auto bg-white rounded-2xl w-5/6 h-auto shadow-custom px-4 py-6 border-t-8 border-green-300"} style={{maxWidth: 310}}>
                            <div className={"flex flex-col"}>
                                <div className={'avatar--me mx-auto md:cursor-pointer'} style={{width: 100, height: 100}}>
                                    <Image
                                        src={user.image}
                                        alt={user.username}
                                        width={100}
                                        height={100}
                                        objectFit={"cover"}
                                        quality={100}
                                    />
                                </div>
                                <div className={"mt-4 font-semibold text-2xl uppercase text-center text-gray-700"}>
                                    @{user.username}
                                </div>
                                <span className={"text-center text-xs text-gray-500 "}>
                                    {`${user.firstName} ${user.lastName}`}
                                </span>
                                <hr className={"my-4"}/>
                                <div className={"text-center"}>
                                    <i className={"text-gray-600"}>แด่ผู้ไม่เคยสมหวังในความรัก : )</i>
                                </div>
                                <div className={"px-2 mt-4"}>
                                    <button className={"w-full py-2 px-4 bg-green-400 font-bold text-white rounded hover:bg-green-500 transition-all duration-150"}>
                                        FOLLOW
                                    </button>
                                </div>
                                <div className={"px-2 mt-5"}>
                                    <div className={"flex items-center gap-4 mb-2"}>
                                        <EmailRounded color={"disabled"} />
                                        <span className={"text-gray-700 text-hidden"}>
                                            {user.email}
                                        </span>
                                    </div>
                                    <div className={"flex items-center gap-4 my-4"}>
                                        <CakeRounded color={"disabled"} />
                                        <span className={"text-gray-500 text-1r"}>
                                            joined {dayjs(user.createdAt).format("DD MMM YY")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
              .shadow-custom {
                box-shadow: 0 0 8px rgba(0, 0, 0, .15);
              }
            `}</style>
        </>
    )
}

UserProfile.getInitialProps = async ({ req, res, query: {userId} }) => {
    const username = userId.slice(1)


    if (req) {
        try {
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/users/${username}`)

            const {data: user, success} = resp.data

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
