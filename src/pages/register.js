import { useState } from 'react'

export default function Register() {
    const [userType, setUserType] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: ''
    })

    return (
        <>
            <h1>this register page</h1>
        </>
    )
}
