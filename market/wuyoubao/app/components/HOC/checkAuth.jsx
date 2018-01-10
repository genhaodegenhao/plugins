import React from 'react'
import { fetchSimulatedLoginToken, fetchLoginToken, fetchAuthorized } from '../../fetch/auth'
import { resultHandler } from "../../fetch/resultHandler"
import Util from '../../util'
import ProductIntroduce from '../wyb/productIntroduce';

export default class CheckAuth extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            isShowAuthPage: false,
            // 传递供子组件使用
            clientLogo: '',
            clientName: '',
            clientId: '',
            redirectUri: '',
            responseType: '',
            scope: '',
            loginToken: '',
            tokenTime: '',
            deviceId: '',
            accessToken: ''
        }
    }

    componentWillMount() {

        // 获取入参
        const clientId = this.getUrlParam('appid')
        const redirectUri = this.getUrlParam('redirect_uri')
        const responseType = this.getUrlParam('response_type') || 'code'
        const scope = this.getUrlParam('scope') || '1'

        this.checkAuthorized({ clientId, redirectUri, responseType, scope }).then(res => {
            resultHandler(res, () => {
                if (res.isAuthorized == '1') { // 已授权
                    if (res.code) {
                        window.location.href = `${redirectUri}?${responseType}=${res.code}`
                    } else {
                        Util.prtMsg('已授权，但code为空')
                    }
                } else if (res.isAuthorized == '0') { // 未授权
                    // 获取clientLogo、clientName, 设置状态供子组件使用
                    this.setState({
                        isShowAuthPage: true,
                        clientLogo: res.clientLogo,
                        clientName: res.clientName,
                        clientId,
                        redirectUri,
                        responseType,
                        scope
                    })
                } else {
                    Util.prtMsg('授权状态为空')
                }
            })
        }).catch(e => {
            Util.prtMsg('查询授权状态异常', e)
        })

    }

    // 通过native获取accessToken
    getAccessToken() {
        return new Promise((resolve, reject) => {
            KQB.native('getAccessToken', {
                success(res) {
                    if (res && res.accessToken) {
                        resolve(res.accessToken)
                    }
                    reject('native未获取到accessToken')
                },
                error(res) {
                    reject('native获取accessToken异常')
                }
            })
        })
        // return new Promise(resolve => {
        //     resolve('accesstoken2222')
        // })
    }

    // 通过native获取deviceId
    getDeviceId() {
        return new Promise((resolve, reject) => {
            KQB.native('getDeviceId', {
                success(res) {
                    if (res && res.deviceId) {
                        resolve(res.deviceId)
                    }
                    reject(res)
                },
                error(res) {
                    reject(res)
                }
            })
        })
        // return new Promise(resolve => {
        //     resolve('deviceId1111')
        // })
    }

    // 获取loginToken
    async checkAuthorized({ clientId, redirectUri, responseType, scope }) {
        let loginToken = null
        if (__DEV__) { // 模拟登陆
            loginToken = await fetchSimulatedLoginToken();
            console.log(loginToken);
            // const deviceId = 'ffffffff-cd10-a2ba-0000-000000000000'
            // const accessToken = encodeURIComponent('y31PZxg2Uy/ZVb7SR8n/U7vjF7sDql9n1pz+bvOkNi0=')
            // loginToken = await fetchLoginToken({ deviceId, accessToken} )
        } else {
            const deviceId = await this.getDeviceId()
            console.log('deviceId: ', deviceId)
            const accessToken = encodeURIComponent(await this.getAccessToken())
            console.log('accessToken: ', accessToken)
            this.setState({
                deviceId,
                accessToken
            })
            loginToken = await fetchLoginToken({ deviceId, accessToken })
        }
        this.setState({
            loginToken,
            tokenTime: +new Date()
        })
        return await fetchAuthorized({ loginToken, clientId, redirectUri, responseType, scope })
    }

    //获取页面url中某个入参
    getUrlParam(paramName) {
        const args = new Object()
        let query = location.search.substring(1) //location.pathname
        let arr = new Array()
        arr = query.split("&")
        for (let i = 0; i < arr.length; i++) {
            let pos = arr[i].indexOf('=')
            if (pos == -1) continue
            let arg_name = arr[i].substring(0, pos)
            let value = arr[i].substring(pos + 1)
            value = decodeURIComponent(value)
            args[arg_name] = value
        }
        return args[paramName]
    }

    render() {
        return (
            <div>
                {this.state.isShowAuthPage ? <ProductIntroduce/> : null}
            </div>
        )
    }

}