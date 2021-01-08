import NProgress from 'nprogress'

NProgress.configure({
    showSpinner: false,
    trickleRate: 0.1,
    trickleSpeed: 800
})

module.exports = { NProgress }
