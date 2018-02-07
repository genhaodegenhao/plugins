let _fetch = (params) => {
  return new Promise((resolve, reject) => {
    let options = {
      url: params.url,
      method: params.method,
      success: function (data) {
        window.app.hidePreloader();
        data = JSON.parse(data);
        /* 请求通过 */
        if (data.status === "00" || data.status === 0 || data.status === "0") {
          params.callback && params.callback(data);
          return resolve(data);
        }
        else if ( data.status === 99) {
          window.app.alert('系统错误！');
        }
        /* loginToken过期 跳转登录 */
        else if (data.status === 401) {
          try {
            // 跳转登录地址;
            sessionStorage.removeItem('dataList');
            sessionStorage.removeItem('userid');
            sessionStorage.removeItem('operLists');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('memberCode');
            if (process.env.NODE_ENV === 'development') {
              location.href = '/index.html';
            } else if (process.env.NODE_ENV === 'stage') {
              location.href = 'https://oms-cloud.99bill.com/stage2/html/agent-sign/index.html';
            } else {
              location.href = 'https://oms-cloud.99bill.com/prod/html/agent-sign/index.html';
            }
            return true;
          } catch(error) {
            return false;
          }
          params.invalidation && params.invalidation();
          return reject(data);
        } else {
          return reject(data);
        }
      },
      error: function (xhr, status) {
        window.app.hidePreloader();
        console.log(status);
        window.app.hidePreloader();
        if (status === "timeout" && params.timeout) {
          let data = {message: '请求超时'};
          return reject(data);
        } else {
          let data = {message: '请求异常'};
          return reject(data);
        }
      },
    };
    if (typeof params.postJSON == "undefined") {
      params.postJSON = true;
    }
    if (params.postJSON) {
      options.contentType = "application/json;charset=UTF-8";
    }
    if (params.headers) {
      options.headers = params.headers;
    }
    if(params.data) {
      params.data = params.data || {};
    }
    if (params.method === 'GET') {
      options.headers = Object.assign({
        'Content-Type': 'application/json',
      }, options.headers);
    }
    options.data = params.postJSON ? JSON.stringify(params.data) : params.data;
    if(!params.loader) { // loading 加载
      window.app.showPreloader("正在加载");
    }
    $$.ajax(options);
  });
};

export default {
  get: function (params) {
    params = params || {};
    params.method = "GET";
    return _fetch(params);
  },
  post: function (params) {
    params = params || {};
    params.method = "POST";
    return _fetch(params);
  }
}
