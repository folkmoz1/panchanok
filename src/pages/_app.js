
import 'tailwindcss/tailwind.css'
import '../../styles/global.css'
import 'nprogress/nprogress.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Router } from 'next/dist/client/router'
import Header from "../components/Header";
import Head from "next/head";
import NProgress from 'nprogress'
import Cookies from 'cookies'
import fetch from "isomorphic-unfetch";
import App from "next/app";
import {AuthProvider} from "../context/AuthContext";
import jwt from 'jsonwebtoken'


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


const MyApp = ({ Component, pageProps, initialProps}) => {


    return (
        <AuthProvider initialData={initialProps}>
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
        </AuthProvider>
    )
}

MyApp.getInitialProps = async context => {
    const { req, res } = context.ctx

    let user, loggedIn

    if (req) {
        const cookie = new Cookies(req, res)

        try {
            const token = cookie.get('tr--')

            const { sub, email } = jwt.verify(token, process.env.TOKEN_SECRET)

            const resp = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/users/${sub}`, {
                method: 'POST',
                headers: {
                    cookie: token
                }
            })

            const { userJSON } = await resp.json()

            user = userJSON

            loggedIn = true

            const newToken = jwt.sign({sub, email}, process.env.TOKEN_SECRET,{
                expiresIn: '1h'
            })

            cookie.set('ta--', newToken)
        }  catch (e) {
            user = null
            loggedIn = false
        }

    }

    const pageProps = await App.getInitialProps(context)

    return { ...pageProps,initialProps : {user, loggedIn}}
}

export default MyApp
