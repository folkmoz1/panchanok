import Slider from 'react-slick'
import Image from "next/image";
import {dayjs} from '../../../../utils/dayjs'
import useSWR, {mutate} from "swr";
import Router, {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";
import {useAuth} from "../../../context/AuthContext";
import {NProgress} from '../../../../utils/NProgress'
import useResize from "../../../hooks/useResize";
import {CardHeader, IconButton, MenuList, Tooltip} from "@material-ui/core";
import Link from "next/link";
import {DeleteOutlined, MoreVert} from "@material-ui/icons";
import {createRef, useState} from "react";
import CustomMenu from "../../../components/Popup/Menu";
import axios from "axios";
import Comment from "../../../components/Comment";
import CommentInput from "../../../components/Comment/Comment--Input";

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
};


const Post_Page = ({post: initial}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [comments, setComments] = useState([])

    const inputRef = createRef()

    const {query: {postId}, replace} = useRouter()
    const {me} = useAuth()
    const {isMobile} = useResize()

    const {data: post} = useSWR(`/api/posts/${postId}`, {
        initialData: initial,
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

                mutate(`/api/posts/${postId}/comments`, [
                    ...comments,
                    {
                       owner: me.id,
                       fullName: `${me.firstName} ${me.lastName}`,
                       username: me.username,
                       createdAt: Date.now(),
                       content: text,
                       profile: me.image
                    }
                ])

                mutate(`/api/posts/${postId}`,{
                    ...post,
                    comments: post.comments + 1
                })

                if (resp?.status === 200) {
                    setTimeout(() => {
                        inputEl.innerHTML = ''
                    },100)
                }

            }
        } catch (e) {
            console.log(e)
        }
    }



    return (
        <>
            <div className={'max-w-screen-xl pb-20 md:p-0'}>
                <div className="flex flex-col gap-8 pt-8 w-full md:pt-0 md:gap-0 md:flex-row min-h-screen-custom">
                    <div className="w-full md:w-1/2 md:pt-20 bg-gray-500">
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
                    <div className="w-full md:w-1/2 ">
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
                                                        <MoreVert/>
                                                    </IconButton>
                                                }
                                            />
                                            {
                                                anchorEl &&
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
                                                                        <DeleteOutlined fontSize={"large"}
                                                                                        color={"disabled"}/>
                                                                    </div>
                                                                    <div className={'min-w-0 flex-grow text-hidden'}>
                                                                        <div>ลบโพสต์</div>
                                                                        <div
                                                                            className={'text-xs text-gray-300'}>ลบโพสต์ออกจากระบบ
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </li>
                                                    </MenuList>
                                                </CustomMenu>
                                            }
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
                                            <Skeleton height={100} width={isMobile ? '100%' : 400}/>
                                        )
                                    }
                                </div>
                                <div className={'text-right text-xs text-gray-500 mb-0.5'}>
                                    {
                                        post &&
                                        <Tooltip
                                            title={'คลิ๊กเพื่อดูความคิดเห็น'}
                                            className={'w-1/3 ml-auto md:cursor-pointer'}
                                        >
                                            <p>ความคิดเห็นทั้งหมด {post.comments}</p>
                                        </Tooltip>
                                    }
                                </div>
                                <div className={'flex justify-between items-center py-2 gap-2'}>
                                    <div className={'flex-0'}>
                                        <button className={'flex items-center py-2 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200'}>
                                            <span className={'flex-0 mr-4'}>
                                                <img src="/images/svg/svg--unlike.svg" width={18} height={18} alt="unlike icon"/>
                                            </span>
                                            <span className={'flex-1'}>
                                                Like
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
                                                <img src="/images/svg/svg--comment.svg" width={18} height={18} alt="unlike icon"/>
                                            </span>
                                            <span>
                                                Comment
                                            </span>
                                        </button>
                                    </div>
                                    <div className={'flex-0'}>
                                        <button className={'flex items-center py-2 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200'}>
                                            <span className={'flex-0 mr-4'}>
                                                <img src="/images/svg/svg--share.svg" width={18} height={18} alt="unlike icon"/>
                                            </span>
                                            <span className={'flex-1'}>
                                                Share
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <hr className={'mb-3'}/>
                                {
                                    me &&
                                    <CommentInput me={me} ref={inputRef} func={addComment} />
                                }
                                <Comment
                                    setComments={setComments}
                                    postId={postId}
                                    me={me}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
              #__next::-webkit-scrollbar {
                width: .25rem;
              }

              #__next::-webkit-scrollbar-thumb {
                background-color: #a0f8e6;
              }

              #__next::-webkit-scrollbar-track {
                background-color: #cac6c6;
              }

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
                min-height: 70px;
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
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/posts/${postId}`)

            const {data, success} = resp.data

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
