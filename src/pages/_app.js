
import 'tailwindcss/tailwind.css'
import '../../styles/global.css'
import 'nprogress/nprogress.css'

import { Router } from 'next/dist/client/router'
import Header from "../components/Header";
import Head from "next/head";
import NProgress from 'nprogress'

NProgress.configure({
    showSpinner: false,
    trickleRate: 0.1,
    trickleSpeed: 800
})

Router.events.on('routerChangeStart', () => {
    NProgress.start()
})

Router.events.on('routerChangeComplete', () => {
    NProgress.done()
})

Router.events.on('routerChangeError', () => {
    NProgress.done()
})

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
