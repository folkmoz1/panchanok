import Menu from "@material-ui/core/Menu";


const CustomMenu = ({
   children,
   anchorEl,
   setAnchorEl,
   nameId
}) => {

    const open = Boolean(anchorEl)
    const id = open ? nameId : undefined

    return (
        <>
            <Menu
                id={id}
                onClose={() => setAnchorEl(null)}
                open={open}
                keepMounted
                anchorEl={anchorEl}
            >
                {children}
            </Menu>
        </>
    )
}

export default CustomMenu

