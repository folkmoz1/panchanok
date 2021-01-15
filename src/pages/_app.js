
import 'tailwindcss/tailwind.css'
import '../../styles/global.css'
import 'nprogress/nprogress.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Router } from 'next/dist/client/router'
import Header from "../components/Header";
import Head from "next/head";
import { NProgress } from '../../utils/NProgress'
import Cookies from 'cookies'
import {SWRConfig} from "swr";
import {AuthProvider} from "../context/AuthContext";
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import axios from "axios";




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
        <SWRConfig
            value={{
                fetcher: url => axios.get(url).then(res => res.data.data)
            }}
        >
            <AuthProvider initialData={initialProps}>
                <Head>
                    <title>panchanok | Home</title>
                    <meta name={'description'} content={'my panchanok'}/>
                </Head>
                <Header />
                <Component {...pageProps} />
                <style jsx global>{`
              body {
                height: 100vh;
                width: 100%;
              }

              #nprogress .bar {
                background: #78f6cb !important;
              }
            `}</style>
            </AuthProvider>
        </SWRConfig>
    )
}

MyApp.getInitialProps = async ({ ctx, Component, router }) => {
    const { req, res } = ctx

    let user, loggedIn, pageProps = {}

    if (req) {

        const cookie = new Cookies(req, res)

        try {
            const token = cookie.get('tr')

            const resp = await axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_URI}/api/me`, null,{
                headers: {
                    cookie: token
                }
            })

            const { userJSON } = resp.data

            user = userJSON

            loggedIn = true

            const newToken = jwt.sign({sub: userJSON.id, email: userJSON.email}, process.env.TOKEN_SECRET,{
                expiresIn: '1h'
            })

            res.setHeader('Set-Cookie', serialize('ta', newToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/'
            }))
        }  catch (e) {
            cookie.set('tr')
            user = null
            loggedIn = false
        }

    }


    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({...ctx, isSsr: !!req})
        pageProps.isSsr = !!req
    }


    return { pageProps, initialProps : {user, loggedIn}}
}

export default MyApp
