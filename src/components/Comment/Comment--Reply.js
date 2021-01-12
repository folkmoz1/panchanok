import Image from "next/image";
import Link from "next/link"
import {CardHeader, IconButton, Tooltip} from "@material-ui/core";
import {dayjs} from "../../../utils/dayjs";
import {MoreVert} from "@material-ui/icons";

const CommentReply = ({comment, me}) => {

    const {fullName, profile, content, createdAt, username, owner} = comment

    return (
        <>
            <li className={'flex'}>
                {/*<CardHeader
                    avatar={
                        <Link href={`/@${username}`}>
                            <a>
                                <div className={'avatar--wrapper'}>
                                    <Image
                                        src={profile}
                                        width={37}
                                        height={37}
                                        objectFit={"cover"}
                                        quality={100}
                                        alt={username}
                                    />
                                </div>
                            </a>
                        </Link>
                    }
                    title={
                        <Link href={`/@${username}`}>
                            <a>{fullName}</a>
                        </Link>
                    }
                    subheader={
                        <p>{content}</p>
                    }
                    action={
                        me && me.id === owner &&
                        <IconButton
                            aria-label={'more'}
                            aria-controls={'manage--btn'}
                            aria-haspopup={"true"}
                        >
                            <MoreVert />
                        </IconButton>
                    }
                />*/}
                <div className={'profile md:cursor-pointer'}>
                    <Image
                        src={profile}
                        width={38}
                        height={38}
                        objectFit={"cover"}
                        alt={fullName}
                    />
                </div>
                <div className={'bg-gray-100 py-1 px-2 rounded max-w-full flex-1'}>
                    <Link href={`/@${username}`}>
                        <a className={'hover:underline contents text-1r font-semibold cursor-default md:cursor-pointer text-hidden'}>
                            <p>
                                {fullName}
                            </p>
                        </a>
                    </Link>
                    <div className={'text-gray-500 text-1r'}>
                        {content}
                    </div>
                </div>
            </li>
            <div className={'mb-3'} />
            <style jsx>{`
              .profile {
                width: 38px;
                height: 38px;
                overflow: hidden;
                border-radius: 50%;
                margin-right: 1rem;
              }
            `}</style>
        </>
    )
}

export default CommentReply
