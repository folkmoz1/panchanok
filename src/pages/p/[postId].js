import dbConnect from "../../../utils/dbConnect";
import Post from "../../../models/Post";
import Slider from 'react-slick'
import Image from "next/image";


const Post_Page = ({ post }) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <>
            <div className={'max-w-screen-xl p-8'}>
                <div className="flex w-full">
                    <div className="w-full md:w-1/2">
                        <Slider {...settings}>
                            {
                                post.images.map(i => (
                                    <Image
                                        src={i.url}
                                        width={400}
                                        height={500}
                                        objectFit={"cover"}
                                    />

                                ))
                            }
                        </Slider>
                    </div>
                    <div className="w-full md:w-1/2"></div>
                </div>
            </div>
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
