import api from '../backend/mixins/api';
import fetch from '../backend/fetch';

class utils {
  /**
   * 验证非负数字
   */
  static vaildNum(res) {
    return /^\d+(\.\d+)?$/.test(res);
  }

  /**
   * 身份证验证
   */
  static vaildCard(res) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(res);
  }

  /**
   * 验证的邮箱
   */
  static vaildEmial(res) {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(res);
  }

  /**
   * 验证的手机号
   */
  static vaildPhoneNum(res) {
    return /^1\d{10}$/.test(res);
  }

  /**
   * 图片上传
   */
  /* eslint-disable */
  static imgUpload(file) {
    // 调接口上传
    console.log(fetch);
    let formData = new FormData();
    formData.append('file', file.files[0]);
    return new Promise((resolve, reject) => {
      console.log(reject);
      window.$$.ajax({
        method: 'POST',
        url: api.apiUrl.uploadFss,
        dataType: 'json',
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        },
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function(res) {
          if (res.status === 0) {  // 成功
            resolve(res.data.fssId);
          }else if (res.status === 401) { // 超时
            // 跳转登录地址;
            sessionStorage.removeItem('dataList');
            sessionStorage.removeItem('userid');
            sessionStorage.removeItem('operLists');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('memberCode');
            location.href = '/index.html';
            return true;
          }
          else {
            window.app.alert(res.message);
          }
        },
        error: function(res) {
          window.app.alert(res.message);
        }
      });
    });
  }

  /**
   * ocr识别
   */
  static ocrRecognize(fileType, fssId) {
    // 调接口ocr识别
    return new Promise((resolve, reject) => {
      console.log(reject);
       const option = {
        url: api.apiUrl.ocrScan,
        data: {
          fileType: fileType,
          fssId: fssId,
        },
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.post(option).then((res) => {
        resolve(res.data);
      }).catch((error) => {
        window.app.alert('识别错误，请重新上传或手动输入！');
      });
    });
  }

  static dialog(option) {
    const div = document.createElement("div");
    div.className = "addCard";
    div.innerHTML = '<div id="addCardMask" class="addCardMask"></div>' + 
      '<div id="contentWrapper" class="addContent">' +
      '<h3>新增台卡付</h3>' +
      '<p>台卡付名称</p>' +
      '<textarea placeholder="请输入台卡付名称"></textarea>' +
      '<div class="btnWrappers">' +
      '<span class="cancle" style="border-right: 0.5px solid #dcdcdc">取消</span>' +
      '<span class="comfirm" >确认</span>' +
      '</div>' +
      '</div>';
      const lcalendar_cancel = div.querySelector(".cancle");
      lcalendar_cancel.addEventListener('touchstart', function(e) {
        e.preventDefault();
        document.body.removeChild(div);
      });

      const lcalendar_finish = div.querySelector(".comfirm");
      lcalendar_finish.addEventListener('touchstart',  option.addCardComfirm);
      document.body.appendChild(div);
  }

  static formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
  }
}

export default utils;

