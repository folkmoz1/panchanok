import { useState, useEffect } from 'react'

const useResize = ({ isOpen, setIsOpen }) => {
    const [isMobile, setIsMobile] = useState(false)


    useEffect(() => {
        setIsMobile(window.innerWidth < 768)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                setIsMobile(false)

                if (!isOpen) {
                    setIsOpen(false)
                }
            } else {
                setIsMobile(true)
            }
        })
    }, [])

    return {
        isMobile
    }
}

export default useResize
