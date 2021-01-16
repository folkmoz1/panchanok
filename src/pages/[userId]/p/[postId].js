import Slider from 'react-slick'
import Image from "next/image";
import {dayjs} from '../../../../utils/dayjs'
import useSWR, {mutate} from "swr";
import {useRouter} from "next/router";
import Skeleton from "react-loading-skeleton";
import {useAuth} from "../../../context/AuthContext";
import {NProgress} from '../../../../utils/NProgress'
import useResize from "../../../hooks/useResize";
import {CardHeader, IconButton, MenuList, Tooltip} from "@material-ui/core";
import Link from "next/link";
import {ArrowBackIosRounded, ArrowForwardIosRounded, DeleteOutlined, MoreVert} from "@material-ui/icons";
import {createRef, useEffect, useRef, useState} from "react";
import CustomMenu from "../../../components/Popup/Menu";
import axios from "axios";
import Comment from "../../../components/Comment";
import CommentInput from "../../../components/Comment/Comment--Input";
import Actions from "../../../components/Actions";




const Post_Page = ({post: initial}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [currentImage, setCurrentImage] = useState(0)

    const inputRef = createRef()
    const scrollIntoView = useRef(null)

    const {query: {postId}, replace, push, asPath} = useRouter()
    const {me} = useAuth()
    const {isMobile} = useResize()

    const {data: post} = useSWR(`/api/posts/${postId}`, {
        initialData: initial,
    })
    const {data: comments} = useSWR(`/api/posts/${postId}/comments`)

    let imgLength = post ? post.images.length - 1 : null

    const deletePost = async () => {
        setAnchorEl(null)
        try {
            if (confirm('ต้องการลบโพสต์หรือไม่')) {
                NProgress.start()
                const resp = await axios.delete(`/api/posts/${postId}`)

                if (resp.status === 200) {
                    NProgress.done()
                    replace('/')
                }
            }

        } catch (e) {
            NProgress.done()
            console.log(e)
        }
    }

    useEffect(() => {
        const sidebarEl = document.querySelector('.sidebar')

        const addClass = () => {
            const scrollY = sidebarEl.scrollTop

            if (scrollY >= 350 ) {
                sidebarEl.classList.add('--active')
            } else {
                sidebarEl.classList.remove('--active')
            }
        }
        if (!isMobile) {
            sidebarEl.addEventListener('scroll', addClass)
        } else {
            sidebarEl.removeEventListener('scroll', addClass)
        }

        return () => sidebarEl.removeEventListener('scroll', addClass)

    },[])


    const addComment = async () => {
        const inputEl = inputRef.current
        try {
            if (inputEl.innerText.trim() !== '') {
                const text = inputEl.innerText.trim()
                while (inputEl.firstChild) inputEl.removeChild(inputEl.firstChild)
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
                ], false)

                mutate(`/api/posts/${postId}`,{
                    ...post,
                    comments: post.comments + 1
                }, false)



                setTimeout(() => {
                    inputEl.innerHTML = ''
                    scrollIntoView.current.scrollIntoView({behavior: "smooth"})
                },0)


                await axios.post(`/api/posts/${postId}/comments`, {
                    content: text,
                    createdAt: Date.now()
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const addActions = async (data, liked) => {
        if (!me) {
            push({
                pathname: '/u/login',
                query: {redirect: asPath}
            }, '/u/login?r=true')

            return
        }

        try {
            if (!liked) {
                mutate(`/api/posts/${postId}/actions`, [
                    ...data,
                    {
                        owner: me.id,
                        fullName: `${me.firstName} ${me.lastName}`,
                        username: me.username,
                        profile: me.image
                    }
                ], false)

                mutate(`/api/posts/${postId}`,{
                    ...post,
                    actions: post.actions + 1
                }, false)
            } else {
                const newData = data.filter(i => i.owner !== me.id)

                mutate(`/api/posts/${postId}/actions`,
                    newData, false)

                mutate(`/api/posts/${postId}`,{
                    ...post,
                    actions: post.actions - 1
                }, false)
            }

            await axios.post(`/api/posts/${postId}/actions`)


        } catch (e) {
            console.log(e)
        }
    }

    const handleImage = side => {

        if (side === 'next' && currentImage + 1 <= imgLength) {
            setCurrentImage(currentImage +1 )
        } else if (side === 'prev' && currentImage - 1 >= 0) {
            setCurrentImage(currentImage - 1)
        }


    }


    return (
        <>
            <div className={'pb-20 md:p-0'}>
                <div className="flex flex-col gap-8 w-full md:gap-0 md:flex-row min-h-screen-custom">
                    <div className="w-full py-8 md:w-1/2  flex-1  md:pt-20 bg-gray-custom relative picture--side select-none">

                            {

                                post ? (
                                    <>
                                        {
                                            imgLength > 1 && currentImage !== 0 &&
                                            <div
                                                className={'left--arrow md:cursor-pointer'}
                                                onClick={() => handleImage('prev')}
                                            >
                                                <ArrowBackIosRounded fontSize={"large"} />
                                            </div>
                                        }
                                        {
                                            post.images.map((img, index) => (
                                                <span key={img.public_id} className={`${currentImage === index ? 'block': 'd-none'}` }>
                                                <div className={'relative p-2 slide  flex justify-center md:p-0'}>
                                                    <Image
                                                        src={img.url}
                                                        width={700}
                                                        height={700}
                                                        objectFit={"contain"}
                                                        alt={post.title}
                                                        quality={100}
                                                        loading={"eager"}
                                                    />
                                                </div>
                                            </span>
                                            ))
                                        }
                                        {
                                            imgLength > 1 && currentImage !== imgLength &&
                                            <div
                                                className={'right--arrow md:cursor-pointer'}
                                                onClick={() => handleImage('next')}
                                            >
                                                <ArrowForwardIosRounded fontSize={"large"} />
                                            </div>
                                        }
                                        <span className={'total--picture text-gray-200'}>
                                            {`${currentImage + 1}/${imgLength + 1}`}
                                        </span>
                                    </>
                                ) : (
                                    <span>
                                        <div className={'flex items-center justify-center mt-4'}>
                                            <Skeleton width={350} height={450}/>
                                        </div>
                                    </span>
                                )
                            }
                    </div>
                    <div className="w-full md:max-w-md md:overflow-auto sidebar">
                        <div className="px-4 pb-4">
                            <div className={'flex flex-col'}>
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
                                                        <p className={'text-gray-400'}>{dayjs(post.createdAt).fromNow(true)}ที่ผ่านมา</p>
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
                                <div className={'text-right text-xs text-gray-500 mb-0.5 px-2'}>
                                    {
                                        post &&
                                        <>
                                            <span
                                                className={'ml-auto md:cursor-pointer flex justify-between items-end'}
                                            >
                                                {
                                                    post.actions !== 0 &&
                                                    <p>ถูกใจ {post.actions} คน</p>
                                                }
                                                {
                                                    post.comments !== 0 &&
                                                    <p>ความคิดเห็นทั้งหมด {post.comments}</p>
                                                }
                                            </span>
                                        </>
                                    }
                                </div>
                                <Actions
                                    me={me}
                                    postId={postId}
                                    addActions={addActions}
                                    inputRef={inputRef}
                                />
                                <hr className={'mb-3'}/>
                                {
                                    me &&
                                    <CommentInput me={me} ref={inputRef} func={addComment} />
                                }
                                <Comment
                                    comments={comments}
                                    postId={postId}
                                    me={me}
                                />
                                <span ref={scrollIntoView}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
              .total--picture {
                position: absolute;
                bottom: 20px;
                left: 50%;
                color: #fff;
                font-size: 1rem;
              }

              .picture--side:hover .left--arrow,.picture--side:hover .right--arrow {
                opacity: 1;
              }

              .left--arrow {
                position: absolute;
                left: 0;
                top: 0;
                padding-left: 1rem;
                height: 100%;
                display: flex;
                align-items: center;
                width: 70px;
                color: #fff;
                transition: all .2s;
                opacity: 0;
                z-index: 4;
              }
              
              .right--arrow {
                position: absolute;
                right: 0;
                top: 0;
                padding-right: 1rem;
                height: 100%;
                justify-content: center;
                display: flex;
                align-items: center;
                width: 70px;
                color: #fff;
                transition: all .2s;
                opacity: 0;
                z-index: 4;
              }
              
              .right--arrow:hover , .left--arrow:hover {
                background-color: rgba(255, 255, 255, .15);
              }
              
              .sidebar::-webkit-scrollbar {
                width: .5rem;
              }

              .sidebar::-webkit-scrollbar-thumb {
                background-color: #a0f8e6;
              }

              .sidebar::-webkit-scrollbar-track {
                background-color: #444;
              }

              #__next {
                overflow: hidden;
              }

              .sidebar.--active .comment--wrapper {
                position: fixed;
                bottom: 0;
                width: 100%;
                z-index: 5;
                max-width: 440px;
                right: .5rem;
                padding: .5rem;
              }

              .sidebar.--active .comment--wrapper ul {
                padding-bottom: 3.5rem;
              }

              .sidebar {
                height: calc(100vh - 70px);
              }

              .avatar--wrapper {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
              }

              .desc {
                font-size: 120%;
                min-height: 70px;
              }


              @media (max-width: 768px) {
                #__next {
                  overflow: auto;
                }
                
                .left--arrow, .right--arrow {
                  width: 40px;
                  padding: 0;
                  opacity: 1;
                }
                
                .total--picture {
                  font-size: .75rem;
                  bottom: 5px;
                }
                
                .sidebar {
                  height: auto;
                }
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
