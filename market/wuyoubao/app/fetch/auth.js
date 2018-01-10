import { post } from './post'
import "regenerator-runtime/runtime"
import Util from '../util'

let apiAddress = 'https://ebd.99bill.com/coc-bill-api';
if(location.href.indexOf("sandbox")!=-1) {
    apiAddress = 'https://ebd-sandbox.99bill.com/coc-bill-api';
}
//const apiAddress = '/api' // mock

// 模拟获取loginTokn
export const fetchSimulatedLoginToken = async () => {
    const idContent = 'ef3P6SU6O71WKoUQxANjRA%253D%253D'
    const password = 'KIMeQKBMBDW844PzHnVqmQ%253D%253D'
    let fetchResult = await post(`${apiAddress}/mam/3.0/members/password/login`, {
        idContent,
        password
    })
    const res = await fetchResult.json()
    if (res && res.loginToken) {
        return res.loginToken
    }
    throw new Error('no loginToken')
}

// 获取loginToken
export const fetchLoginToken = async ({ deviceId, accessToken }) => {
    let fetchResult = await post(`${apiAddress}/auth/3.0/app`, {
        deviceId,
        accessToken
    })
    const res = await fetchResult.json()
    console.log('fetchedLoginToken: ', res)
    if (res && res.loginToken) {
        return res.loginToken
    }
    throw new Error('no loginToken')
}

// 查询是否授权
export const fetchAuthorized = async ({ loginToken, clientId, redirectUri, responseType, scope }) => {
    let fetchResult = await post(`${apiAddress}/mam/3.0/members/user/isAuthorization`, {
        clientId,
        redirectUri,
        responseType,
        scope
    }, { Authorization: loginToken })
    const res = await fetchResult.json()
    console.log('fetchAuthorized result: ', res)
    return res
}

// 授权
export const fetch2Authorize = async ({ loginToken, clientId, redirectUri, responseType }) => {
    let fetchResult = await post(`${apiAddress}/mam/3.0/members/user/confirmAuthorization`, {
        clientId,
        redirectUri,
        responseType,
    }, { Authorization: loginToken })
    const res = await fetchResult.json()
    console.log('fetch2authorize result: ', res)
    return res
}






