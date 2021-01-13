import Image from "next/image";
import Link from "next/link";
import {IconButton} from "@material-ui/core";
import {MoreVert} from "@material-ui/icons";
import { dayjs } from "../../../utils/dayjs";


const CommentList = ({ comment, me }) => {

    const {fullName, profile, content, createdAt, username, owner} = comment

    return (
        <>
            <li className={'mb-3'}>
                <div className="flex py-2 w-full">
                    <div className="flex-0">
                        <Link href={`/@${username}`}>
                            <a className={'inline'}>
                                <div className={'profile'}>
                                    <Image
                                        src={profile}
                                        width={38}
                                        height={38}
                                        objectFit={"cover"}
                                        quality={100}
                                        alt={username}
                                    />
                                </div>
                            </a>
                        </Link>
                    </div>
                    <div className="ml-2 min-w-0 flex-grow">
                        <div className="flex">
                            <div className={'py-1 pl-2 pr-4 max-w-full rounded cont'}>
                                    <Link href={`/@${username}`}>
                                        <a className={'hover:underline contents text-1r font-semibold cursor-default md:cursor-pointer '}>
                                            <div className={'mb-1 overflow-hidden whitespace-nowrap overflow-ellipsis'}>{fullName}</div>
                                        </a>
                                    </Link>
                                    <div>
                                    <p className={'text-gray-900 break-words whitespace-pre-wrap mb-1'}>{content}</p>
                                    </div>
                            </div>
                        </div>
                        <div className="px-2 flex">
                            <div className="flex items-start mt-2">
                                <div className={'mr-2 text-gray-400 text-xs'}>
                                   {dayjs(createdAt).format('DD MMM เมื่อ H:mm')}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        me && me.id === owner &&
                        <div className={'flex-0 items-start action'}>
                            <IconButton
                                aria-label={'more'}
                                aria-controls={'manage--btn'}
                                aria-haspopup={"true"}
                            >
                                <MoreVert />
                            </IconButton>
                        </div>
                    }
                </div>
            </li>
            <style jsx>{`
              .cont {
                background: #fcfcfc;
              }

              li:hover .action {
                opacity: 1;
              }

              .profile {
                width: 38px;
                height: 38px;
                overflow: hidden;
                border-radius: 50%;
              }

              .action {
                opacity: 0;
                margin-top: -5px;
                margin-right: -8px;
              }
            `}</style>
        </>
    )
}

export default CommentList
