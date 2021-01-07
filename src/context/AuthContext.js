import { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext({
    me: null,
    setMe: () => {}
})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children, user }) => {
    const [me, setMe] = useState(user)


    return (
        <AuthContext.Provider value={{
            me,
            setMe
        }}>
            {children}
        </AuthContext.Provider>
    )
}
