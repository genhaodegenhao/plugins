/**
 * author: jhl
 * date: 2017-12-5
 * 业务接口返回初步处理
 */
import Util from '../util'

export const resultHandler = (res, cb) => {
    if (res) {
        if (res.errCode == '00') {
            cb()
        } else {
            // const { errMsg, errCode } = res
            Util.prtMsg(res.errMsg || '无错误信息')
        }
    } else {
        Util.prtMsg('返回接口为空')
    }
}


 
 