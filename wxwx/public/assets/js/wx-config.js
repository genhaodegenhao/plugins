window.$$ = Dom7; //eslint-disable-line
window.$$.ajax({
  method: 'GET',
  url: 'https://ebd.99bill.com/coc-bill-api/wx/3.0/wxResource/wxConfig',
  dataType: 'json',
  data: {
    bindSource: '99bill001',
    url: encodeURIComponent(window.location.href.split('#')[0]),
  },
  contentType: 'application/json;charset=UTF-8',
  headers: {
    pubData: JSON.stringify({ c: 'H5', b: 'MKT', id: '998', t: new Date() / 1 }),
  },
  success: function(res) {
    console.log(res);
    if(res.errCode === '00') {
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.noncestr, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见附录1
        jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      console.log(wx.config);
      wx.error(function(res){
        console.log('wexinE'+res);
      });

      wx.ready(function(res){
      });
    }
    
  }
});