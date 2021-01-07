
import 'tailwindcss/tailwind.css'
import '../../styles/global.css'
import 'nprogress/nprogress.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Router } from 'next/dist/client/router'
import Header from "../components/Header";
import Head from "next/head";
import NProgress from 'nprogress'


NProgress.configure({
    showSpinner: false,
    trickleRate: 0.1,
    trickleSpeed: 800
})

Router.events.on("routeChangeStart", () => {
    NProgress.start()
});
Router.events.on("routeChangeComplete", () => {
    NProgress.done()
});
Router.events.on("routeChangeError", () => {
    NProgress.done()
});


const MyApp = ({ Component, pageProps }) => {


    return (
        <>
            <Head>
                <title>panchanok | Home</title>
                <meta name={'description'} content={'my panchanok'}/>
            </Head>
            <Header />
            <Component {...pageProps} />
            <style jsx global>{`
              #nprogress .bar {
                background: #78f6cb !important;
              }
            `}</style>
        </>
    )
}

export default MyApp
