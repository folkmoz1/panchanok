import Slider from 'react-slick'
import Image from "next/image";
import {dayjs} from '../../../../utils/dayjs'
import useSWR, {mutate} from "swr";
import Router, {useRouter} from "next/router";
import fetch from "isomorphic-unfetch";
import Skeleton from "react-loading-skeleton";
import {useAuth} from "../../../context/AuthContext";
import { NProgress } from '../../../../utils/NProgress'
import useResize from "../../../hooks/useResize";
import {CardHeader, IconButton, MenuList, Tooltip} from "@material-ui/core";
import Link from "next/link";
import {DeleteOutlined, MoreVert} from "@material-ui/icons";
import {createRef, useEffect, useState} from "react";
import CustomMenu from "../../../components/Popup/Menu";
import CommentInput from "../../../components/Comment/Comment--Input";
import axios from "axios";
import CommentReply from "../../../components/Comment/Comment--Reply";

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
};
const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const Post_Page = ({post: initial}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [state, setState] = useState(false)

    const inputRef = createRef()

    const {query: {postId}, replace} = useRouter()
    const  { me } = useAuth()
    const { isMobile } = useResize()

    const {data: post, revalidate} = useSWR(() => !initial ? `/api/posts/${postId}` : null, fetcher, {
        initialData: initial
    })

    const deletePost = async () => {
        setAnchorEl(null)
        try {
            if (confirm('ต้องการลบโพสต์หรือไม่')) {
                NProgress.start()
                const resp = await fetch(`/api/posts/${postId}`, {
                    method: 'DELETE',
                })

                if (resp?.status === 200) {
                    mutate('/api/posts')
                    NProgress.done()
                    replace('/')
                }
            }

        } catch (e) {
            NProgress.done()
            console.log(e)
        }
    }

    const addComment = async () => {
        const inputEl = inputRef.current
        try {
            if (inputEl.innerText.trim() !== '') {
                const text = inputEl.innerText
                while (inputEl.firstChild) inputEl.removeChild(inputEl.firstChild)
                const resp = await axios.put(`/api/posts/${postId}`, {
                    content: text
                })

                if (resp?.status === 200) {
                    setState(true)
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (state) {
            revalidate()
                .then(() => setState(false))
                .catch(err => console.log(err))
        }
    },[state])

    return (
        <>
            <div className={'max-w-screen-xl p-8'}>
                <div className="flex flex-col gap-16 w-full md:gap-0 md:flex-row">
                    <div className="w-full md:w-1/2 md:pt-20">
                        <Slider {...settings}>
                            {
                                post ? (
                                    post.images.map(i => (
                                        <span key={i.public_id}>
                                            <div className={'relative p-2 slider flex justify-center md:p-0'}>
                                                <Image
                                                    src={i.url}
                                                    width={350}
                                                    height={450}
                                                    objectFit={"cover"}
                                                    alt={post.title}
                                                    quality={100}
                                                    loading={"eager"}
                                                />
                                            </div>
                                        </span>
                                    ))
                                ) : (
                                    <span>
                                        <div className={'flex items-center justify-center'}>
                                        <Skeleton width={350} height={450}/>
                                        </div>
                                    </span>
                                )
                            }
                        </Slider>
                    </div>
                    <div className="w-full md:w-1/2 md:pt-16">
                        <div className="p-4">
                            <div className={'content'}>
                                {
                                    post ? (
                                        <>
                                            <CardHeader
                                                avatar={
                                                    <Link href={`/@${post.author.username}`}>
                                                        <a>
                                                            <div className={'avatar--wrapper'}>
                                                                <Image
                                                                    src={post.author.profile}
                                                                    width={40}
                                                                    height={40}
                                                                    objectFit={"cover"}
                                                                    quality={100}
                                                                    alt={post.author.fullName}
                                                                />
                                                            </div>
                                                        </a>
                                                    </Link>
                                                }
                                                title={
                                                    <Link href={`/@${post.author.username}`}>
                                                        <a>{post.author.fullName}</a>
                                                    </Link>
                                                }
                                                subheader={
                                                    <Tooltip title={dayjs(post.createdAt).add(543,'year').format('DD MMMM YYYY')}>
                                                        <p className={'timestamp'}>{dayjs(post.createdAt).fromNow(true)}ที่ผ่านมา</p>
                                                    </Tooltip>
                                                }
                                                action={
                                                    me && me.id === post.author.id &&
                                                    <IconButton
                                                        onClick={({currentTarget}) => setAnchorEl(currentTarget)}
                                                        aria-label={'more'}
                                                        aria-controls={'manage--btn'}
                                                        aria-haspopup={"true"}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                }
                                            />
                                            <CustomMenu
                                                nameId={'manage--btn'}
                                                setAnchorEl={setAnchorEl}
                                                anchorEl={anchorEl}
                                            >
                                                <MenuList>
                                                    <li className={'whitespace-nowrap'}>
                                                        <button
                                                            className={'w-full py-2 px-4 hover:bg-gray-50'}
                                                            onClick={deletePost}
                                                        >
                                                            <div className={'flex text-left w-full'}>
                                                                <div className={'mr-2 text-3xl'}>
                                                                    <DeleteOutlined fontSize={"large"} color={"disabled"} />
                                                                </div>
                                                                <div className={'min-w-0 flex-grow text-hidden'}>
                                                                    <div>ลบโพสต์</div>
                                                                    <div className={'text-xs text-gray-300'}>ลบโพสต์ออกจากระบบ</div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </li>
                                                </MenuList>
                                            </CustomMenu>
                                        </>
                                    ) : (
                                        <div className={'gap-1 flex flex-col'}>
                                            <Skeleton width={300} height={40} />
                                            <Skeleton width={100} height={23} />
                                        </div>
                                    )
                                }
                                <hr className={'my-2'}/>
                                <div className={'w-auto flex items-center mt-2 mb-3'}>
                                    {
                                        post ? (
                                            <>
                                                <span className={'text-2xl mr-3 text-gray-300'}>title :</span>
                                                <div
                                                    className={`break-all bg-gray-200 rounded-2xl text-2xl outline-none p-1 px-4  inline-block `}
                                                >
                                                    {post.title}
                                                </div>
                                            </>
                                        ) : (
                                            <Skeleton width={150} height={35} />
                                        )
                                    }
                                </div>
                                <hr/>
                                <div className={'mt-8'}>
                                    {
                                        post ? (
                                            <>
                                                <div className="desc">
                                                    <p className={'desc text-xs text-gray-700'}> {post.desc}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <Skeleton height={100} width={isMobile ? '100%' : 400} />
                                        )
                                    }
                                </div>
                                <hr className={'mb-3'}/>
                                {
                                    me && (
                                        <>
                                            <CommentInput func={addComment} ref={inputRef} me={me}/>
                                            <hr className={'my-3'}/>
                                        </>
                                    )
                                }
                                {
                                    post && post.comments.length !== 0 &&
                                        <div>
                                            <ul>
                                                {
                                                    post.comments.map(comment => (
                                                        <CommentReply key={comment.createdAt} comment={comment} />
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
              .avatar--wrapper {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
              }

              .slick-list, .slick-track {
                touch-action: pan-y;
              }

              .desc {
                font-size: 120%;
                min-height: 150px;
              }

              img[alt="${post && post.author}"] {
                width: 100%;
                height: 100%;
                border-radius: 1rem;
              }

              .slider > div {
                box-shadow: 0 0 6px rgba(0, 0, 0, .6);
                border-radius: 1rem;
                overflow: hidden;
                height: 450px;
                width: 350px;

              }

              .slick-dots li:hover button:before {
                color: rgb(159, 8, 8) !important;
                transform: scale(1.1);
                transition: 0.2s all;
              }

              .slick-active button:before {
                color: #cb3837 !important;
              }

              .content {
                display: flex;
                flex-direction: column;

              }

              .timestamp {
                color: gray;
              }

              .author {
                font-size: 200%;
                font-weight: bold;
              }
            `}</style>
        </>
    )
}

Post_Page.getInitialProps = async ({ req, res, query: {postId} }) => {
    if (req) {
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/posts/${postId}`)

            const {data, success} = await resp.json()

            if (!success) throw new Error()

            return {post: data}

        } catch (e) {
            if (req) {
                res.writeHead(302, {
                    Location: '/p/new'
                })
                res.end()
            } else {
                Router.replace('/p/new')
            }
        }
    } else {
        return {post: null}
    }


}


export default Post_Page
