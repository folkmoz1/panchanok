import dbConnect from "../../../utils/dbConnenct";
import Post from "../../../models/Post";
import Card__Component from "../../components/Card";


const Post_Page = ({ post }) => {

    return (
        <>
            <Card__Component post={post} />
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
