import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext({
    me: null,
    isLoggedIn: false,
    setMe: () => {}
})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children, initialData: {user, loggedIn} }) => {
    const [me, setMe] = useState(user)
    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)

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
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useIsAuthenticated() {
    const context = useAuth();
    return context.isLoggedIn;
}
