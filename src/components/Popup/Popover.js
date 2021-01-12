import Popover from "@material-ui/core/Popover";


const CustomPopover = ({
    children,
    anchorEl,
    setAnchorEl,
    nameId
}) => {

    const open = Boolean(anchorEl)
    const id = open ? nameId : undefined

    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {children}
            </Popover>
        </>
    )
}

export default CustomPopover
