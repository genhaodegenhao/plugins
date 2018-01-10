/**
 * author: jhl
 * date: 2017-12-1
 */

export default class Util {
    /**
     * 输出异常
     * @param msg string 用于native显示toast异常
     * @param info string 具体的异常
     */
    static prtMsg(msg, info) {
        // reject后捕获到的e直接为信息; throw new Error('xx')后捕获到的e.message为信息
        console.log(msg, info.message ? info.message : info)
        if (!__DEV__) {
            //KQB.native('showToast', {message: `${msg instanceof Object ? JSON.stringify(msg) : msg}`})
            KQB.native('showToast', {message: '出错啦，请稍后重试'})
            if (!__CONSOLE__) { // 不开控制台，提示错误后关闭页面
                setTimeout(() => {
                    KQB.native("goback", {})
                }, 2000)
            }
        }
    }
}

