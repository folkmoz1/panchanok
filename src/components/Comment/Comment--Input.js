import Image from "next/image";
import {IconButton} from "@material-ui/core";
import {forwardRef} from "react";


const CommentInput = forwardRef(({children, func, me}, ref) => {

    return (
        <>
            <div className={'comment--wrapper'}>
                <div className={'avatar--me mr-2'}>
                    <Image
                        src={me.image}
                        width={40}
                        height={40}
                        objectFit={"cover"}
                        quality={100}
                        alt={me.firstName + ' ' + me.lastName}
                        loading={"eager"}
                    />
                </div>
                <div className={'flex-1 md:mt-0.5'}>
                    <div
                        className={`content-editable cursor-text bg-gray-100 rounded-2xl outline-none py-2 px-4 min-w-0`}
                        data-placeholder={`แสดงความคิดเห็น...`}
                        suppressContentEditableWarning
                        contentEditable
                        ref={ref}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                func()
                            }
                        }}
                    />
                </div>
                <div className={'ml-2'}>
                    <IconButton onClick={func}>
                        <Image
                            src={'/images/svg/svg--send.svg'}
                            width={20}
                            height={20}
                            objectFit={"contain"}
                            loading={"eager"}
                        />
                    </IconButton>
                </div>
            </div>
            <style jsx>{`
              .comment--wrapper {
                display: flex;
                justify-content: space-between;
                background-color: #fff;
              }

              @media (max-width: 768px) {
                .comment--wrapper {
                  position: fixed;
                  bottom: 0;
                  width: 100%;
                  background: #fff;
                  left: 0;
                  z-index: 1;
                  align-items: start;
                  height: auto;
                  min-height: 50px;
                  padding: .5rem;
                  box-shadow: 0px -1px 0px rgba(0, 0, 0, .2);
                }
              }

              .content-editable:empty:before {
                content: attr(data-placeholder);
                color: rgba(0, 0, 0, 0.42);
              }
            `}</style>
        </>
    )
})

export default CommentInput
