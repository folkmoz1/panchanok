import Card__Component from "../components/Card";
import useSWR from "swr";
import Link from "next/link";
import axios from "axios";
import React from "react";
import { useState } from "react";


const Home = ({ posts: initialData, isSsr }) => {
    const [currentPost, setCurrentPost] = useState(null)

    const { data: posts, error } = useSWR(!isSsr ? '/api/posts' : null, {
        revalidateOnMount: true,
        initialData
    })

    const getPost = postId => {
        setCurrentPost(posts.filter(post => post._id === postId))
    }


    if (!posts) {
        return (
            <>
                <div className={'flex flex-col mt-16 justify-center items-center'}>
                    <img src="/images/svg/loading--text.svg" width={170} height={150} alt="loading animation"/>
                </div>
            </>
        )
    }

    if (error) {
        return <p>error, Try again.</p>
    }

    return (
        <>
            <div className={'max-w-screen-lg h-full md:h-3/4  mx-auto'}>
                <div className="py-8 h-full flex  items-center flex-col sm:flex-wrap sm:flex-row sm:items-start">
                    {
                        posts.map(post => (
                            <Link href={`/@${post.author.username}/p/${post._id}`}  key={post._id}>
                                <a>
                                    <Card__Component post={post} key={post._id} />
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
Home.getInitialProps = async ({ req, res, isSsr }) => {

    if (isSsr) {
        try {
            const resp = await axios.get(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/posts`)

            const { data } = resp.data

            return  { posts: data }
        } catch (e) {
            return { posts: null }
        }
    }

    return { }
}


export default Home
