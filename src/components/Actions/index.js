import Router from "next/router";
import useSWR from "swr";
import {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";

const Actions = ({me, inputRef, addActions, postId}) => {
    const [liked, setLiked] = useState(false)

    const { data: actions } = useSWR(`/api/posts/${postId}/actions`)

    useEffect(() => {
        if (actions && me) {
            const checked = actions.filter(i => i.owner === me.id)
            setLiked(checked.length === 1)
        }
    },[actions])

    if (!actions) {
        return <Skeleton width={'100%'} height={40} className={'my-2'}/>
    }

    return (
        <>
            <div className={'flex justify-between items-center py-2 gap-2'}>
                <div className={'flex-0'}>
                    <button
                        onClick={() => addActions(actions, liked)}
                        className={`flex items-center py-2 px-4 rounded-2xl ${liked ? 'bg-red-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        <span className={'flex-0 mr-4'}>
                            <img
                                src={
                                    liked ? (
                                        `/images/svg/svg--liked.svg`
                                    ) : `/images/svg/svg--unlike.svg`
                                }
                                width={18}
                                height={18}
                                alt="unlike icon"/>
                        </span>
                        <span className={`flex-1 ${liked && 'text-red-600'}`}>
                            {liked ? 'Liked' : 'Like'}
                        </span>
                    </button>
                </div>
                <div className={'flex-1'}>
                    <button
                        onClick={() => {
                            if (me) inputRef.current.focus()
                            else Router.push({
                                pathname: '/u/login',
                                query: {redirect: Router.asPath}
                            }, '/u/login?r=true')
                        }}
                        className={'flex items-center justify-center py-2 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 w-full'}
                    >
                        <span className={'mr-4'}>
                            <img src="/images/svg/svg--comment.svg" width={18} height={18}
                                 alt="unlike icon"/>
                        </span>
                        <span>
                            Comment
                        </span>
                    </button>
                </div>
                <div className={'flex-0'}>
                    <button className={'flex items-center py-2 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200'}>
                        <span className={'flex-0 mr-4'}>
                            <img src="/images/svg/svg--share.svg" width={18} height={18}
                                 alt="unlike icon"/>
                        </span>
                        <span className={'flex-1'}>
                            Share
                        </span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default Actions
