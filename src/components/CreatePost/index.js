import CustomModal from "../Modal";
import Form from "../Form";
import {useEffect, useState} from "react";

const CreatePost = ({open, setOpen}) => {
    const [loading, setLoading] = useState(false)


    return (
        <>
            <CustomModal
                open={open}
                setOpen={setOpen}
                loading={loading}
            >
                <div
                    className={'h-auto flex flex-col md:flex-row'}
                >
                    <Form setLoading={setLoading} loading={loading} setOpen={setOpen}/>
                </div>
                {
                    !loading &&
                    <span
                        className={'close--btn'}
                        onClick={() => setOpen(false)}
                    >
                        <img
                            src="/images/svg/svg--close.svg"
                            alt="close modal icon"
                            width={17}
                            height={17}
                        />
                    </span>
                }
                {
                    loading &&
                    <div className={'spinner--wrapper'}>
                        <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                }
            </CustomModal>
            <style jsx>{`
              .spinner--wrapper {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
              }

              .lds-ring {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
              }

              .lds-ring div {
                box-sizing: border-box;
                display: block;
                position: absolute;
                width: 64px;
                height: 64px;
                margin: 6px;
                border: 8px solid #fdd;
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #6beeef transparent transparent transparent;
              }

              .lds-ring div:nth-child(1) {
                animation-delay: -0.45s;
              }

              .lds-ring div:nth-child(2) {
                animation-delay: -0.3s;
              }

              .lds-ring div:nth-child(3) {
                animation-delay: -0.15s;
              }

              @keyframes lds-ring {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }

              .close--btn {
                position: absolute;
                top: 12px;
                right: 10px;
                cursor: pointer;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: 0.2s background-color;
              }

              .close--btn:hover {
                background: #eef0f1;
              }

              .close--btn:active {
                background-color: #d0d2d2;
              }
            `}</style>
        </>
    )
}

export default CreatePost
