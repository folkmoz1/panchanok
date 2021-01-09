import { createContext, useState, useEffect, useContext } from 'react'
import { NProgress } from '../../utils/NProgress'
import Router from "next/router";

const AuthContext = createContext({
    me: null,
    isLoggedIn: false,
    setMe: () => {},
    handleLogout: () => {}
})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children, initialData: {user, loggedIn} }) => {
    const [me, setMe] = useState(user)
    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)

    const handleLogout = async (setLoading, setIsOpen) => {
        try {
            NProgress.start()
            const resp = await fetch('/api/users/logout',{
                method: 'POST',
                headers: {
                    uid: me.id
                }
            })

            if (resp.status === 200) {
                NProgress.done()
                setMe(null)
                setIsLoggedIn(false)
                setLoading(false)
                setIsOpen(false)
                Router.push('/u/login')
            }

        } catch (e) {
            NProgress.done()
            console.log(e)
        }
    }

    useEffect(() => {
        if (me !== null || undefined) {
            setIsLoggedIn(true)
        }
    },[me])

    return (
        <AuthContext.Provider value={{
            me,
            setMe,
            isLoggedIn,
            handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useIsAuthenticated() {
    const context = useAuth();
    return context.isLoggedIn;
}
