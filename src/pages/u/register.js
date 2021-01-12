import { useState } from 'react'
import axios from "axios";
import { NProgress } from '../../../utils/NProgress'
import {useAuth} from "../../context/AuthContext";
import {useRouter} from "next/router";

function checkProperties(obj) {
    for (let key in obj) {
        if (obj[key] === "")
            return false;
    }
    return true;
}

export default function Register() {
    const [userType, setUserType] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: ''
    })
    const [error, setError] = useState('')

    const { replace } = useRouter()
    const { setMe } = useAuth()

    const onTextChange = ({ target }) => {
        setUserType(prev => ({...prev, [target.name]: target.value}))
    }

    const submitForm = async () => {
        if (checkProperties(userType)) {
            try {
                NProgress.start()
                const resp = await axios.post('/api/auth/register', userType)

                const { user } = resp.data

                if (resp.status === 201) {
                    setMe(user)
                    NProgress.done()
                    replace('/')
                }

            } catch (e) {
                NProgress.done()
                console.log(e)
            }
        } else {
            setError('กรอกข้อมูลให้ครบ')
        }
    }

    return (
        <>
            <div className="flex w-full sm:max-w-screen-sm h-full justify-center sm:h-auto md:pt-16 mx-auto">
                <div className="bg-white shadow-md m-0  w-full px-8 pt-6 pb-8 flex flex-col sm:rounded sm:my-2">
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <h1 className={'title text-green-400'}>Sign up</h1>
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
                                name={'firstName'}
                                placeholder="Folk"
                                onChange={onTextChange}
                                value={userType.firstName}
                            />
                            <p className="text-red text-xs italic"></p>
                        </div>
                        <div className="md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                                name={'lastName'}
                                placeholder="Moz"
                                onChange={onTextChange}
                                value={userType.lastName}
                            />
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-full px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="Email">
                                Email
                            </label>
                            <input
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                                name={'email'}
                                type="email"
                                placeholder="test@example.com"
                                onChange={onTextChange}
                                value={userType.email}
                            />
                            <p className="text-grey-dark text-xs italic"></p>
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-full px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="Username">
                                Username
                            </label>
                            <input
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                                name={'username'}
                                placeholder="panchanok"
                                onChange={onTextChange}
                                value={userType.username}
                            />
                            <p className="text-grey-dark text-xs italic"></p>
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-full px-3">
                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
                                name={'password'}
                                type="password"
                                placeholder="*************"
                                onChange={onTextChange}
                                value={userType.password}
                            />
                            <p className="text-grey-dark text-xs italic"></p>
                        </div>
                    </div>
                    <div className="-mx-3 md:flex mb-2">
                        <button
                            onClick={submitForm}
                            className={'ml-3 py-3 font-semibold px-12 text-white rounded-full bg-green-400 text-xl'}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
            <style jsx global>{`
              body {
                background-image: linear-gradient(-105deg,#009acc,#cbfdef);
              }


              .title {
                font-weight: bold;
                font-size: 250%;
                margin-top: 15px;
              }
            `}</style>
        </>
    )
}
