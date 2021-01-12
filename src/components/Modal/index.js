import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'

const CustomModal = ({ children, open, setOpen, loading }) => {

    const ModalBody = (
        <div id={'modal--wrapper'} className={"relative w-full h-screen bg-white outline-none transition-none py-8 px-5 md:mx-5 md:h-auto md:max-w-screen-xl "}>
            {children}
        </div>
    )

    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                className={'flex justify-center items-center'}
                disableBackdropClick={loading}
            >
                <Fade in={open}>
                    {ModalBody}
                </Fade>
            </Modal>
            <style jsx global>{`
              #modal--wrapper:after {
                ${loading ? 'content: "";' : ''}
                position: absolute;
                inset: 0;
                background-color: rgba(255,255,255,.6);
              } 
            `}</style>
        </>
    )
}

export default CustomModal
