import { useState, useEffect } from 'react'

const useResize = () => {
    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
        const checkIsMobile = () => {
            if (window.innerWidth > 768) {
                setIsMobile(false)

            } else {
                setIsMobile(true)
            }
        }
        window.addEventListener('resize', checkIsMobile)

        return () => {
            window.removeEventListener("resize", checkIsMobile)
        }
    }, [])

    return {
        isMobile
    }
}

export default useResize
