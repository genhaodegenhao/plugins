/**
 * author: jhl
 * date: 2017-11-22
 */
import 'whatwg-fetch'
import 'es6-promise'


const ua = window.navigator.userAgent.toLowerCase()

const env = (function() {
    const is = agent => {
        agent = agent.toLowerCase()
        return ua.indexOf(agent) > -1
    }
    return {
        iOS: is('iphone') || is('ipad') || is('ipod'),
        Android: is('android'),
        KQ: is('kuaiqianbao'),
        FeiFan: is('feifan'),
        KQSDK: is('kuaiqianpaysdk'),
        FFTSDK: is('fftpaysdk'),
        Weixin: is('micromessenger'),
        KQCSDK: is('KuaiQianCreditapplySDK'),
        is
    }
}())

const parseUrlQuery = url => {
    const query = {}
    let urlToParse = url || window.location.href
    let i, params, param, length
    if (typeof urlToParse === 'string' && urlToParse.length) {
        urlToParse = urlToParse.indexOf('?') > -1 ? urlToParse.replace(/\S*\?/, '') : ''
        params = urlToParse.split('&').filter(paramsPart => paramsPart !== '')
        length = params.length
        for (i = 0; i < length; i += 1) {
            param = params[i].replace(/#\S+/g, '').split('=')
            query[decodeURIComponent(param[0])] = typeof param[1] === 'undefined' ? undefined : decodeURIComponent(param[1]) || ''
        }
    }
    return query
}

// business后面改为调用时传入即可通用
const pubData = (business='MEMBER-BASE') => {
    let channel = 'H5'
    const appid = '100'
    const query = parseUrlQuery(window.location.search)
    if (env.KQ) {
        channel = 'app-kq'
    }
    if (env.FeiFan) {
        channel = 'app-ffan'
    }
    if (env.Weixin && query.code) {
        channel = 'wx-kqqb'
    }
    if (typeof business === 'undefined') {
        throw new Error('缺少参数:business, 业务参数查看:http://kb.99bill.net/pages/viewpage.action?pageId=15438204')
    }
    return JSON.stringify({c: channel, b: business, id: appid, t: Date.now()})
}


export const post = (url, paramsObj, headersParam) => {
    const fetchParam = {
        method: 'POST',
        credentials: 'include', // with cookie
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'pubData': pubData()
        },
        body: JSON.stringify(paramsObj)
    }
    if (headersParam) {
        fetchParam.headers = { ...fetchParam.headers, ...headersParam }
    }
    console.log('fetchUrl: ', url, 'fetchParam: ', fetchParam)
    return fetch(url, fetchParam)
}


