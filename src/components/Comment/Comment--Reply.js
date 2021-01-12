import Image from "next/image";
import Link from "next/link"

const CommentReply = ({comment}) => {

    const {fullName, profile, content, createdAt, username} = comment

    return (
        <>
            <li className={'flex'}>
                <div className={'profile'}>
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
                        <a className={'hover:underline text-1r font-semibold cursor-default md:cursor-pointer text-hidden'}>
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
