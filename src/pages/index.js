/*import dbConnect from "../../utils/dbConnenct";
import Post from "../../models/Post";*/
import Card__Component from "../components/Card";
import useSWR from "swr";
import Link from "next/link";


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
        return (
            <>
                <div className={'flex flex-col mt-16 justify-center items-center'}>
                    <svg version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg"
                         xmlnsXlink="http://www.w3.org/1999/xlink"
                         x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve">
                        <circle fill="none" stroke="#cb3837" strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50"
                                r="48"/>
                        <line fill="none" strokeLinecap="round" stroke="#cb3837" strokeWidth="4" strokeMiterlimit="10"
                              x1="50" y1="50" x2="85" y2="50.5">
                            <animateTransform
                                attributeName="transform"
                                dur="2s"
                                type="rotate"
                                from="0 50 50"
                                to="360 50 50"
                                repeatCount="indefinite"/>
                        </line>
                        <line fill="none" strokeLinecap="round" stroke="#cb3837" strokeWidth="4" strokeMiterlimit="10"
                              x1="50" y1="50" x2="49.5" y2="74">
                            <animateTransform
                                attributeName="transform"
                                dur="15s"
                                type="rotate"
                                from="0 50 50"
                                to="360 50 50"
                                repeatCount="indefinite"/>
                        </line>
                    </svg>
                    <h3 className={'animate-bounce'}>Loading...</h3>
                </div>
                <style jsx global>{`
                  svg {
                    width: 100px;
                    height: 100px;
                    margin: 20px;
                    display: inline-block;
                  }
                  
                  h3 {
                    font-size: 160%;
                    font-weight: bold;
                    letter-spacing: 5px;
                    margin-left: 2rem;
                  }
                `}</style>
            </>
        )
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
                            <Link href={'/p/[postId]'} as={`/p/${post._id}`} key={post._id}>
                                <a>
                                    <Card__Component post={post} />
                                </a>
                            </Link>
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
