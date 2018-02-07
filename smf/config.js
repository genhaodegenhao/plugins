/**
 * author:shimin.chen;
 * time:2017/8/31;
 * description:配置文件;
 */

//stage2环境下的生产配置
var commonUrl = 'https://pay.99bill.com/stage2/html/smf';
//之前的stage2支付宝appid为：2017082908444914
//之前的stage2微信appid为：  wxc81c4ae33fe525f0
var config = { 
    wxAppId:'wx7a7dd5f3fdc4bfdc', //微信appid
    zfbAppId:'2017090608586834', //支付宝appid
    appId:'coc-bill-api',//应用appid
    msfRedirectUrl:commonUrl + '/msf-1.0/default.html',//码上付重定向地址
    csbRedirectUrl:commonUrl + '/csb-1.0/default.html'//c扫b重定向地址
}


//prod环境下的生产配置
// var commonUrl = 'https://pay.99bill.com/prod/html/smf';
// var config = {
//     wxAppId:'wx723625da26fd3d89', 
//     zfbAppId:'2017090608586834', 
//     appId:'coc-bill-api',
//     msfRedirectUrl:commonUrl + '/msf-1.0/default.html',
//     csbRedirectUrl:commonUrl + '/csb-1.0/default.html'
// }