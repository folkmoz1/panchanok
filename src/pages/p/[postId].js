import dbConnect from "../../../utils/dbConnect";
import Post from "../../../models/Post";
import Slider from 'react-slick'
import Image from "next/image";


const Post_Page = ({ post }) => {

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <>
            <div className={'max-w-screen-xl p-8'}>
                <div className="flex w-full">
                    <div className="w-full md:w-1/2 md:pt-20">
                            <Slider {...settings}>
                                {
                                    post.images.map(i => (
                                        <span key={i.public_id}>
                                            <div className={'slider flex justify-center'}>
                                                <Image
                                                    src={i.url}
                                                    width={350}
                                                    height={450}
                                                    objectFit={"cover"}
                                                    alt={post.author}
                                                    quality={100}
                                                />
                                                {/*<div>
                                                    <img src={i.url} alt={post.author}  className={'object-cover'}/>
                                                </div>*/}
                                            </div>
                                        </span>
                                    ))
                                }
                            </Slider>
                    </div>
                    <div className="w-full md:w-1/2"></div>
                </div>
            </div>
            <style jsx global>{`
              img[alt="${post.author}"] {
                  width: 100%;
                  height: 100%;
              }
              
              .slider div{
                 box-shadow: 0 0 6px rgba(0, 0, 0, .6);
                 border-radius: 16px;
                 overflow: hidden;
                 height: 450px;
                 width: 350px;
                 
              }
              
              .slick-dots li:hover button:before {
                color: red!important;
              }
              
              .slick-active button:before {
                color: red!important;
              }
            `}</style>
        </>
    )
}

export const getServerSideProps = async ({ params }) => {
    try {
        await dbConnect()

        const post = await Post.findById(params.postId).lean()
        post._id = post._id.toString()

        return  { props: { post }}

    } catch (e) {
        return {
            notFound: true
        }
    }
}

export default Post_Page
