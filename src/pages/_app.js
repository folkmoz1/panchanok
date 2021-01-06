
import 'tailwindcss/tailwind.css'
import '../../styles/global.css'
import 'nprogress/nprogress.css'

import Header from "../components/Header";
import Head from "next/head";

const MyApp = ({ Component, pageProps }) => {

    return (
        <>
            <Head>
                <title>panchanok | Home</title>
                <meta name={'description'} content={'my panchanok'}/>
            </Head>
            <Header />
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
