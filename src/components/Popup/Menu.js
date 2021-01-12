import Menu from "@material-ui/core/Menu";


const CustomMenu = ({
   children,
   anchorEl,
   setAnchorEl,
   nameId
}) => {

    const open = Boolean(anchorEl)

    return (
        <>
            <Menu
                id={nameId}
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

