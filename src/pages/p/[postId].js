import Slider from 'react-slick'
import Image from "next/image";
import {dayjs} from '../../../utils/dayjs'
import useSWR from "swr";
import Router, { useRouter } from "next/router";
import fetch from "isomorphic-unfetch";

const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};
const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const Post_Page = ({post: initialData}) => {
    const {query: {postId}, replace} = useRouter()

    const { data: {data: post}, error } = useSWR(`/api/posts/${postId}`,{ initialData })

    if (!post) {
        return <h1>Loading...</h1>
    }

    if (error) {
        replace('/p/new')
    }


    const {author, desc, createdAt, images, title} = post


    return (
        <>
            <div className={'max-w-screen-xl p-8'}>
                <div className="flex flex-col gap-16 w-full md:gap-0 md:flex-row">
                    <div className="w-full md:w-1/2 md:pt-20">
                        <Slider {...settings}>
                            {
                                images.map(i => (
                                    <span key={i.public_id}>
                                            <div className={'p-2 slider flex justify-center md:p-0'}>
                                                <Image
                                                    src={i.url}
                                                    width={350}
                                                    height={450}
                                                    objectFit={"cover"}
                                                    alt={post.author}
                                                    quality={100}
                                                />
                                            </div>
                                        </span>
                                ))
                            }
                        </Slider>
                    </div>
                    <div className="w-full md:w-1/2 md:pt-16">
                        <div className="p-4">
                            <div className={'content'}>
                                <h1 className={'author'}>{author}</h1>
                                <p className={'timestamp'}>{dayjs(createdAt).fromNow(true)}ที่ผ่านมา</p>
                                <hr className={'my-2'}/>
                                <div className={'w-auto flex items-center mt-3'}>
                                    <span className={'text-2xl mr-3 text-gray-300'}>title |</span>
                                    <div
                                        className={`content-editable break-all bg-gray-200 rounded-2xl outline-none p-1 px-4 font-sans inline-block whitespace-pre-wrap `}
                                        data-placeholder={`${title}`}
                                        suppressContentEditableWarning
                                    />
                                </div>
                                <div className={'mt-8'}>
                                    <p className={'ml-3 text-red-400'}>description</p>
                                    <div className="border-4 border-dashed p-8 m rounded-2xl">
                                        <p className={'desc'}> {desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
              .slick-list, .slick-track {
                touch-action:pan-y; 
               }
  
              .content-editable:empty:before {
                content: attr(data-placeholder);
                color: #000;
                font-size: 150%;
              }
              
              .desc {
                font-size: 120%;
              }

              img[alt="${post.author}"] {
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
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/posts/${postId}`)

        const post = await resp.json()

        return  { post }

    } catch (e) {
        if (req) {
            res.writeHead(302, {
                Location: '/p/new'
            })
            return {}
        } else {
            Router.replace('/p/new')
            return {}
        }
    }

}

/*export const getServerSideProps = async ({ params, query }) => {
    try {
        await dbConnect()

        const post = await Post.findById(query.id).lean()
        post._id = post._id.toString()

        return  { props: { post }}

    } catch (e) {
        return {
            redirect: {
                destination: '/p/new'
            }
        }
    }
}*/

export default Post_Page
