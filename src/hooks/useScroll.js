import React from "react";

export const useScroll = () => {
    const [offset, setOffset] = React.useState(0)
    const [isScroll, setIsScroll] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset)

        }


        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }, [])

    React.useEffect(() => {
        if (offset > 20) {
            setIsScroll(true)
        } else {
            setIsScroll(false)
        }

    }, [offset])

    return {
        offset,
        isScroll
    }
}
