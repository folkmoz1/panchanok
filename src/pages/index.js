import dbConnenct from "../../utils/dbConnenct";
import Post from "../../models/Post";
import Card__Component from "../components/Card";

const Home = ({ initialData }) => {

    return (
        <>
            <div className={'max-w-screen-md h-auto md:h-3/4  mx-auto'}>
                <div className="py-8 h-full flex flex-wrap items-center flex-col sm:flex-row sm:items-start">
                    {
                        initialData.map(post => (
                            <Card__Component post={post} key={post._id} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async ({req, res}) => {
    await dbConnenct()

    const results = await Post.find({})
    const posts = results.map(doc => {
        const post = doc.toObject()
        post._id = post._id.toString()
        return post
    })

    return {
        props:{
            initialData: posts
        }
    }
}

export default Home
