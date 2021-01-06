/*import dbConnect from "../../utils/dbConnenct";
import Post from "../../models/Post";*/
import Card__Component from "../components/Card";
import useSWR from "swr";

const fetcher = (url) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data)

const Home = ({ initialData }) => {

    /*const { data: posts, error } = useSWR('/api/posts', fetcher, {
        initialData,
        revalidateOnMount: true
    })*/

    const { data: posts, error } = useSWR('/api/posts', fetcher)

    if (!posts) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>error, Try again.</p>
    }

    return (
        <>
            <div className={'max-w-screen-lg h-full md:h-3/4  mx-auto'}>
                <div className="py-8 h-full flex flex-wrap items-center flex-col sm:flex-row sm:items-start">
                    {
                        posts.map(post => (
                            <Card__Component post={post} key={post._id} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

/*export const getServerSideProps = async ({req, res}) => {
    await dbConnect()

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
}*/

export default Home
