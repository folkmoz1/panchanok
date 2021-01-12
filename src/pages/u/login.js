import {useState} from 'react'
import {useRouter} from "next/router";
import Image from 'next/image'
import {useAuth} from "../../context/AuthContext";
import withoutAuth from "../../hocs/withoutAuth";
import NProgress from 'nprogress'
import { motion } from "framer-motion";

NProgress.configure({
    showSpinner: false,
    trickleRate: 0.1,
    trickleSpeed: 800
})

export default withoutAuth( function Login() {
    const router = useRouter()

    const { setMe } = useAuth()

    const [userType, setUserType] = useState({
        userOrEmail: '',
        password: ''
    })

    const onTextChange = ({ target }) => {
        setUserType(prev => ({...prev, [target.name]: target.value}))
    }

    const submitForm = async e => {
        e.preventDefault()
        if (!userType.password || !userType.userOrEmail) return

        try {
            NProgress.start()
            const { userOrEmail, password } = userType

            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    userOrEmail,
                    password
                })
            })


            if (resp.status === 200) {

                const { user } = await resp.json()
                setMe(user)
                NProgress.done()
                router.push('/')
            }

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <div style={{height: 'calc(100vh - 70px)'}} className={'w-full sm:max-w-screen-2xl mx-auto md:pt-20'}>
                <div className="w-full h-full flex justify-end">
                    <div className="px-4 d-none sm:w-2/3 md:ml-14 md:mr12 md:block">
                        <Image
                            src={'/images/svg/svg--login-2.svg'}
                            width={500}height={600}
                            objectFit={"contain"}
                        />
                    </div>
                    <div className="w-full  sm:mx-auto sm:mt-32 sm:max-w-xl md:mt-0 md:w-2/3">
                        <div className={'w-full h-full sm:mx-auto sm:w-5/6 flex justify-center md:justify-end sm:h-auto'}>
                            <form onSubmit={submitForm} className={'bg-white h-full  flex flex-col w-full sm:rounded-2xl shadow-md md:mt-14 --form'}>
                                <h1 className={'uppercase'}>sign in</h1>
                                <div className={'flex flex-col my-3 '}>
                                    <label
                                        htmlFor="userOrEmail"
                                        className={'mb-2'}
                                    >Username or Email</label>
                                    <input
                                        name={'userOrEmail'}
                                        className={` shadow-sm px-4 py-2 rounded-2xl bg-gray-50  dark:bg-gray-700 ring-4 ${userType.username ? 'ring-green-300' : 'ring-gray-100'} focus:ring-blue-300`}
                                        autoComplete={'off'}
                                        onChange={onTextChange}
                                        value={userType.userOrEmail}
                                    />
                                </div>
                                <div className={'flex flex-col my-3 '}>
                                    <label
                                        htmlFor="password"
                                        className={'mb-2'}
                                    >Password</label>
                                    <input
                                        type={'password'}
                                        name={'password'}
                                        autoComplete={'off'}
                                        className={` shadow-sm px-4 py-2 rounded-2xl bg-gray-50  dark:bg-gray-700 ring-4 ${userType.password ? 'ring-green-300' : 'ring-gray-100'} focus:ring-blue-300`}
                                        onChange={onTextChange}
                                        value={userType.password}
                                    />
                                </div>
                                <button
                                    type={"submit"}
                                    className={'shadow-sm p-4 mt-14  w-full text-xl text-white uppercase mx-auto ring-4 ring-red-700 bg-red-500 rounded '}
                                    disabled={!userType.userOrEmail || !userType.password}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
              body {
                ${router.asPath === '/u/login' &&
                `background-image: radial-gradient(ellipse at center, rgba(255,254,234,1) 0%, rgba(255,254,234,1) 35%, #B7E8EB 100%)
                 `}
              }
              
              .--form {
                min-height: 300px;
                padding: 2rem;
              }

              .--form h1 {
                font-size: 3rem;
                color: #444;
                font-weight: bold;
                text-shadow: 2px 2px 2px rgba(0, 0, 0, .4);
                cursor: default;
                margin-bottom: 1.5rem;
              }
            `}</style>
        </>
    )
})

