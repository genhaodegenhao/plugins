import React from 'react';
import utils from '../../../utils/utils.js';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import description from '../../../utils/description.js';
import s from './store-terminal.less';
import _h5t from '../../../utils/h5t.js';

class StoreTerminal extends React.Component {
  constructor(props) {
    super(props);
    const enterpriseInfParames = JSON.parse(sessionStorage.getItem('enterpriseInfParames'));
    const creditParames = JSON.parse(sessionStorage.getItem('creditParames'));
    console.log(enterpriseInfParames);
    this.state = {
      swicthType: 'open',
      idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
      applyId: '', // string  
      storeId: '', // 门店id
      storeName: enterpriseInfParames ? enterpriseInfParames.merchantName : '', // 门店 名称 string  
      contact: enterpriseInfParames ? enterpriseInfParames.legalName : '', // 联系人 string 
      mobile: enterpriseInfParames ? enterpriseInfParames.mobilephone : '', //  手机号 string   
      city: creditParames ? creditParames.registCity : '', // 城市  string   
      province: creditParames ? creditParames.registProvince : '', //  省份  string
      county: '', //  区县  string  
      addr: creditParames ? creditParames.registAddress : '', // 地址  string  
      overDoorFileName: '', // 门头照片名字 string
      overDoorFssId: '', // 门头照片fssid string  
      overDoorImageType: '', // 门头照类型
      checkStandFileName: '', // 收银台名字 strin
      checkStandFssId: '', // 收银台照片fssId  string 
      checkStandImageType: '', // 收银台照片名称
      qrCode: '', //  二维码URL  string
      qrCodeNum: '', // 二维码的编号  string 
      qrCodeList: [], // 台卡列表
      terminalList: [], // 终端列表  array<object> 
      userId: sessionStorage.getItem('userid'), // 操作员编号 string
      ydPosNum: 0, // 移动pos数量
      gwPosNum: 0, // 固网pos数量
      jyPosNum: 0, // 简易pos数量
      kqsNum: 0, // 快钱刷数量
      qkfNum: 0, // 轻快付数量
      isSave: 0, // 可以保存
      deleteMark: '0', // 台卡删除标志
      isAddCard: '0', // 增加台卡
      provinceCityList: [], // 省市列表
    };
    this.storeNameChange = this.storeNameChange.bind(this);
    this.contactChange = this.contactChange.bind(this);
    this.mobileChange = this.mobileChange.bind(this);
    this.countySelect = this.countySelect.bind(this);
    this.addrChange = this.addrChange.bind(this);

    this.imgUploadChange = this.imgUploadChange.bind(this);

    this.addNum = this.addNum.bind(this);
    this.mulitNum = this.mulitNum.bind(this);

    this.scanQRCode = this.scanQRCode.bind(this);
    this.storeMasking = this.storeMasking.bind(this);
    this.posDesMark = this.posDesMark.bind(this);
    this.saveBtn = this.saveBtn.bind(this);
    this.vaildParames = this.vaildParames.bind(this);

    this.addCard = this.addCard.bind(this);
    this.addCardComfirm = this.addCardComfirm.bind(this);
    this.addCardCancle = this.addCardCancle.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
    this.cancleDeleteClick = this.cancleDeleteClick.bind(this);

    this.deleteMarkClick = this.deleteMarkClick.bind(this);

    this.downLoadImage = this.downLoadImage.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const pages = window.app.onPageInit('p/store-terminal.html', (page) => {
      if (page.query && page.query.id) { // 有查询参数
        _this.setState({
          applyId: page.query.id,
        }, () => {
          pages.remove();
        });
      }
      if (page.query && page.query.storeTerminalMessage) {
        const item = page.query.storeTerminalMessage;
        _this.setState({
          storeId: item.storeId,
          idContent: item.idContent,
          applyId: item.applyId, // string  
          storeName: item.storeName, // 门店 名称 string  
          contact: item.contact, // 联系人 string 
          mobile: item.mobile, //  手机号 string   
          city: item.city, // 城市  string   
          province: item.province, //  省份  string
          county: item.county, //  区县  string  
          addr: item.addr, // 地址  string  
          overDoorFileName: item.overDoorFileName, // 门头照片名字 string
          overDoorFssId: item.overDoorFssId, // 门头照片fssid string  
          overDoorImageType: item.overDoorImageType, // 门头照类型
          checkStandFileName: item.checkStandFileName, // 收银台名字 strin
          checkStandFssId: item.checkStandFssId, // 收银台照片fssId  string 
          checkStandImageType: item.checkStandImageType, // 收银台照片名称
          qrCode: item.qrCode, //  台卡链接  strin
          qrCodeName: item.storeName, // 台卡名称  string  
          qrCodeNum: item.qrCodeNum, // 二维码的编号  string 
          qrCodeList: item.qrCodeList, // 台卡列表
          terminalList: item.terminalList, // 终端列表  array<object> 
        }, () => {
          /* eslint-disable */
          _this.state.terminalList.map((val, index) => {
            console.log(index);
            if (val.terminalType === '1') { // 固网pos数量
              _this.setState({
                gwPosNum: val.terminalCount
              });
            }
            if (val.terminalType === '2') { // 移动pos数量
              _this.setState({
                ydPosNum: val.terminalCount
              });
            }
            if (val.terminalType === '3') { // 简易pos数量
              _this.setState({
                jyPosNum: val.terminalCount
              });
            }
            if (val.terminalType === '5') { // 快钱刷数量
              _this.setState({
                kqsNum: val.terminalCount
              });
            }
            if (val.terminalType === '6') { // 轻快付数量
              _this.setState({
                qkfNum: val.terminalCount
              });
            }
          });
          _this.downLoadImage(_this.state.overDoorFssId, '1',function() {
            _this.downLoadImage(_this.state.checkStandFssId, '2');
          });
          _this.vaildParames();
        });
      }
    });
    // 查询省市数据
    const option = {
      url: api.apiUrl.zoneList,
      data: {},
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token
      }
    };
    fetch.post(option).then((data) => {
      if (data.data.length) {
        sessionStorage.setItem('cityData', JSON.stringify(data.data));
        _this.setState({
          provinceCityList: data.data,
        });
      }
    }).catch((error) => {
      console.log(error);
    });
    // 页面埋点
    const params = {
      eventId: 'H5_agentSign_P_storeTerminal',
    };
    _h5t.track('pageview', params);
  }

  /**
   * 下载图片
   */
  /* eslint-disable */
  downLoadImage(id, fileType, callback) {
    const option = {
      url: api.apiUrl.downLoadImage,
      data: {
        fssId: id,
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token
      }
    };
    fetch.post(option).then((data) => {
      const file = fileType;
      let img = null;
      if (file === '1') {
        img = window.$$('.page-on-center .overDoorImg');
        img.attr('src', data.data.imageBase64);
        img.show();
        img.prev('span').hide();
      } else if (file === '2') {
        img = window.$$('.page-on-center .checkStandImg');
        img.attr('src', data.data.imageBase64);
        img.show();
        img.prev('span').hide();
      };
      callback && callback();
    }).catch((error) => {
      callback && callback();
      window.app.alert(error.message);
    });
  }

  /**
   * 门店名称change
   */
  storeNameChange(e) {
    const _this = this;
    _this.setState({
      storeName: e.target.value,
      qrCodeName: e.target.value
    }, () => {
      _this.vaildParames();
    });
  }


  /**
   * 联系人change
   */
  contactChange(e) {
    const _this = this;
    _this.setState({
      contact: e.target.value,
    }, () => {
      _this.vaildParames();
    });
  }

  /**
   * 手机号change
   */
  mobileChange(e) {
    const _this = this;
    _this.setState({
      mobile: e.target.value,
    }, () => {
      _this.vaildParames();
    });
  }

  /**
   *  地区选择
   */
  /* eslint-disable */
  countySelect() {
    const _this = this;
    new Picker({
      'title': '请选择地区',//标题(可选)
      'defaultValue': '',//默认值-多个以空格分开（可选）
      'type': 3,//需要联动级数[1、2、3]（可选）
      'data': _this.state.provinceCityList,//数据(必传)
      'keys': {
          'id': 'Code',
          'value': 'Name',
          'childData': 'level'//最多3级联动
      },//数组内的键名称(必传，id、text、data)
      'callBack': function (val,code) {
        const province = val.split(' ')[0];
        const city = val.split(' ')[1];
        const county = val.split(' ')[2];
        _this.setState({
          city: city, // 城市  string   
          province: province, //  省份  string
          county: county,
        }, () => {
          _this.vaildParames();
        });  
      }
    });
  }

  /**
   * 详细地址change
   */
  addrChange(e) {
    const _this = this;
    _this.setState({
      addr: e.target.value,
    }, () => {
      _this.vaildParames();
    });
  }

  /**
   * 上传
   */
  imgUploadChange(e) {
    const _this = this;
    const file = e.target;
    const reader = new FileReader();
    const fileType = e.target.getAttribute('data-fileType');
    const extensionName = file.value.split('.')[1].toLocaleLowerCase(); // 转小写
    if ((extensionName!='jpg')&&(extensionName!='gif')&&(extensionName!='jpeg')&&(extensionName!='png')&&(extensionName!='bmp')) {
      window.app.alert("对不起，系统仅支持标准格式的照片，请您调整格式后重新上传，谢谢 !");
      return;
    }
    if (file.files[0].size / 1024 / 1024 > 3) {  // 限制大小为5M
      window.app.alert("对不起，系统仅支持3M以下的照片，请您调整图片大小后重新上传，谢谢!");
      return;
    }
    if (fileType === '1') { // 门头照片
      const img = window.$$('.page-on-center .overDoorImg');
      const fileThis = file;
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        utils.imgUpload(fileThis).then((res) => {
          img.show();
          img.prev('span').hide();
          _this.setState({
            overDoorFssId: res,
            overDoorFileName: fileThis.files[0].name,
            overDoorImageType: fileThis.value.split('.')[1],
          }, () => {
            _this.vaildParames();
          });
        });
      };
    }
    if (fileType === '2') { // 内景照片
      const img = window.$$('.page-on-center .checkStandImg');
      const fileThis = file;
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        utils.imgUpload(fileThis).then((res) => {
          img.show();
          img.prev('span').hide();
          _this.setState({
            checkStandFssId: res,
            checkStandFileName: fileThis.files[0].name,
            checkStandImageType: fileThis.value.split('.')[1],
          }, () => {
            _this.vaildParames();
          });
        });
      };
    }
  }

  /**
   * 增加数量
   */
  addNum(e) {
    const _this = this;
    const terminalType  = $$(e.target).attr('data-terminalType');
    let terminalList = _this.state.terminalList;
    switch(terminalType) {
      case '1': // 固网pos数量
        let numGw = _this.state.gwPosNum;
        numGw ++ ;
        let isPush = true;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
              val.terminalCount = numGw;
              isPush = false;
          };
        });
        if(isPush) { // 是否push
          terminalList.push({
            terminalType: terminalType,
            terminalCount: numGw,
          });
        }
        _this.setState({
          gwPosNum: numGw,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '2': // 移动pos
        let num = _this.state.ydPosNum;
        num ++ ;
        let isPushNum = true;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            val.terminalCount = num;
            isPushNum = false;
          };
        });
        if(isPushNum) { // 是否push
          terminalList.push({
            terminalType: terminalType,
            terminalCount: num,
          });
        }
        _this.setState({
          ydPosNum: num,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '3': // 简易pos数量
        let numJy = _this.state.jyPosNum;
        numJy ++ ;
        let isPushJy = true;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            val.terminalCount = numJy;
            isPushJy = false
          };
        });
        if(isPushJy) { // 是否push
          terminalList.push({
            terminalType: terminalType,
            terminalCount: numJy,
          });
        }
        _this.setState({
          jyPosNum: numJy,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '5': // 快钱刷数量
        let numKqs = _this.state.kqsNum;
        numKqs ++ ;
        let isPushKqs = true;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            val.terminalCount = numKqs;
            isPushKqs = false;
          };
        });
        if(isPushKqs) { // 是否push
          terminalList.push({
            terminalType: terminalType,
            terminalCount: numKqs,
          });
        }
        _this.setState({
          kqsNum: numKqs,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '6': // 轻快付数量
        let numQkf = _this.state.qkfNum;
        numQkf ++ ;
        let isPushQkf = true;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            val.terminalCount = numQkf;
            isPushQkf = false;
          };
        });
        if(isPushQkf) { // 是否push
          terminalList.push({
            terminalType: terminalType,
            terminalCount: numQkf,
          });
        }
        _this.setState({
          qkfNum: numQkf,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      default:
    }
  }

  /**
   * 减少数量
   */
  mulitNum(e) {
    const _this = this;
    const terminalType  = $$(e.target).attr('data-terminalType');
    let terminalList = _this.state.terminalList;
    switch(terminalType) {
      case '1': // 固网pos数量
        let numGw = _this.state.gwPosNum;
        if(numGw === 0) {
          window.app.alert('已经是最小值！');
          return;
        }
        numGw -- ;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            if(numGw === 0) {
              terminalList.splice(i,1);
            } else {
              val.terminalCount = numGw;
            }
          };
        });
        _this.setState({
          gwPosNum: numGw,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '2': // 移动pos
        let num = _this.state.ydPosNum;
        if(num === 0) {
          window.app.alert('已经是最小值！');
          return;
        }
        num -- ;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            if(num === 0) {
              terminalList.splice(i,1);
            } else {
              val.terminalCount = num;
            }
          };
        });
        _this.setState({
          ydPosNum: num,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '3': // 简易pos数量
        let numJy = _this.state.jyPosNum;
        if(numJy === 0) {
          window.app.alert('已经是最小值！');
          return;
        }
        numJy -- ;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            if(numJy === 0) {
              terminalList.splice(i,1);
            } else {
              val.terminalCount = numJy;
            }
          };
        });
        _this.setState({
          jyPosNum: numJy,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '5': // 快钱刷数量
        let numKqs = _this.state.kqsNum;
        if(numKqs === 0) {
          window.app.alert('已经是最小值！');
          return;
        }
        numKqs -- ;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            if(numKqs === 0) {
              terminalList.splice(i,1);
            } else {
              val.terminalCount = numKqs;
            }
          };
        });
        _this.setState({
          kqsNum: numKqs,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      case '6': // 轻快付数量
        let numQkf = _this.state.qkfNum;
        if(numQkf === 0) {
          window.app.alert('已经是最小值！');
          return;
        }
        numQkf -- ;
        terminalList.map((val, i) => {
          if (val.terminalType === terminalType) {
            if(numQkf === 0) {
              terminalList.splice(i,1);
            } else {
              val.terminalCount = numQkf;
            }
          };
        });
        _this.setState({
          qkfNum: numQkf,
          terminalList: terminalList
        }, () => {
          _this.vaildParames();
        });
        break;
      default:
    }
  }


  storeMasking() {
    this.setState({ 'swicthType': 'open' });
    const popupHTML1 =  '<div class="popup masking">' +
                        '<div class="contentWrapper">' +
                          '<h5>照片要求：清晰可见</h5>' +
                            '<h3>【门头照片要求】</h3>' +
                            '<div class="itemWrapper">' + 
                              '<h5>1.商户经营场所外部的全景照片，需包含商户门头经营名称或商户标志，经营名称与内景照片所体现的经营内容要匹配；</h5>' +
                              '<h5>2.全景照片要能体现经营场所建筑物的名称、外观、门牌号三项中的一项，可体现商户所处的地理位置；</h5>' +
                            '</div>' +
                          '</div>' +
                          '<div class="contentWrapper">'+
                            '<h3>【经营场所内景及收银台照片】</h3>' +
                            '<div class="itemWrapper">' +
                              '<h5>1.经营场所照片要体现商户所经营的商品类型，或所提供的服务内容，且经营项目是在商户营业执照范围内；</h5>' +
                              '<h5>2.特殊类商户如房产、汽车、批发类商户：需要体现出商户从事该行业的关联性要素，如：楼板沙盘、房产信息板、汽车展厅、货物仓储照片等；</h5>' +
                              '<h5>3.可体现商户的收银台或收款所在地；</h5>' +
                            '</div>' +
                          '</div>' +
                        '<div class="closewrapper close-popup">' +
                          '<i></i>' + 
                        '</div>' +
                      '</div>';
    window.app.popup(popupHTML1);
  }

  posDesMark(e) {
    const type = $$(e.target).attr('data-type');
    const popupHTML = '<div class="popup masking">'+
                    '<div class="content-block contentWrapper">'+
                    description.desMark[type] + 
                    '<div class="closewrapper close-popup">'+
                    '<i></i>'
                    '</div>'+
                    '</div>';
    window.app.popup(popupHTML);
  }

  /**
   * 二维码扫描
   */
  scanQRCode() {
    const _this = this;
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        console.log(res);
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
        _this.setState({
          qrCode: result,
        });
        const option = {
          url: api.apiUrl.queryMaInfo + '?qrCode=' + result,
          headers: {
            authorization: JSON.parse(sessionStorage.getItem('dataList')).token
          }
        };
        fetch.get(option).then((data) => {
          _this.setState({
            qrCodeName: _this.state.storeName,
            qrCodeNum: data.data.qrNum,
          });
        }).catch((error) => {
          window.app.alert(error.message);
        });
      }
    });
  }

  /**
   * 台卡新增
   */
  addCard() {
    const _this = this;
    utils.dialog({
      addCardComfirm:function(e){
        e.preventDefault();
        const value = $$(e.target).closest('#contentWrapper').find('textarea').val();
        const qrCodeList = _this.state.qrCodeList;
        const qrCodeNum = _this.state.qrCodeNum;
        const qrCodeName = _this.state.qrCodeName;
        let len = 0;
        let falg = true;
        // 校验名字
        if (value === qrCodeName) {
          $$(".addCard").remove();
          window.app.alert('此台卡付已经存在，请重新输入！');
          falg = false;
        }
        qrCodeList.map((item, index) => {
          if (value === item.qrName) {
            $$(".addCard").remove();
            window.app.alert('此台卡付已经存在，请重新输入！');
            falg = false;
          }
        });
        if (falg) { // 台卡名称校验
          if (qrCodeNum === '') { // 先码有值，控制14个
            len = 15;
          } else {
            len = 14;
          }
          if (value !== '') {
            if (qrCodeList.length < len) {
              if (value.length <= 10) {
                qrCodeList.push({
                  qrName: value,
                });
                _this.setState({
                  qrCodeList: qrCodeList
                }, () => {
                  $$(".addCard").remove();
                  _this.vaildParames();
                });
              } else {
                $$(".addCard").remove();
                window.app.alert('台卡付名称不能超过10个字！')
              }
            } else {
              $$(".addCard").remove();
              window.app.alert('新增台卡付最多为15个！')
            }
          } else {
            $$(".addCard").remove();
            window.app.alert('请输入台卡名称！')
          }
        }
      }
    });
  }

  /**
   * 新增台卡确认
   */
  addCardComfirm(e) {
    
    this.setState({ isAddCard: '0' });
  }

  /**
   * 新增台卡取消
   */
  addCardCancle(e) { 
    $$('#addCardMask').hide();
    this.setState({ isAddCard: '0' });
  }

  /**
   * 删除台卡
   */
  deleteClick() {
    this.setState({ deleteMark: '1' });
  }

   /**
   * 取消删除
   */
  cancleDeleteClick() {
    this.setState({ deleteMark: '0' });
  }

  /**
   * 删除标志点击
   */
  deleteMarkClick(e) {
    const _this = this;
    const qrname = e.target.getAttribute('data-name');
    const qrCodeList = _this.state.qrCodeList;
    window.app.confirm('确认要删除该台卡信息吗？', '删除提示',
      () => { // 确定按钮
        qrCodeList.map((item, index) => {
          console.log(index);
          if(item.qrName === qrname) {
            qrCodeList.splice(index, 1);
          } 
        });
        _this.setState({
          deleteMark: '0',
          qrCodeList: qrCodeList
        }, () => {
          _this.vaildParames();
        });
      },
      () => { // 取消按钮
        _this.setState({ deleteMark: '0' });
      }
    );
  }

  /**
   * 保存
   */
  saveBtn() {
    const _this = this;
    if (_this.state.isSave === '1') {
      const paremes = {
        addr: _this.state.addr, // 地址  string  
        storeId: _this.state.storeId, // 门店id
        applyId: _this.state.applyId, // string  
        checkStandFileName: _this.state.checkStandFileName, // 收银台照片名称 string  
        checkStandFssId: _this.state.checkStandFssId, // 收银台照片fssId  string  
        checkStandImageType: _this.state.checkStandImageType, // string  
        city: _this.state.city, // 城市  string  
        contact: _this.state.contact, // 联系人 string  
        county: _this.state.county, // 区县  string  
        idContent: _this.state.idContent, // 代理商快钱账户 string  
        mobile: _this.state.mobile, // 手机号 string  
        overDoorFileName: _this.state.overDoorFileName, // string  
        overDoorFssId: _this.state.overDoorFssId, // 门头照片fssid string  
        overDoorImageType: _this.state.overDoorImageType, // string  
        province: _this.state.province, // 省份  string  
        qrCode: _this.state.qrCode,
        qrCodeList: _this.state.qrCodeList, //  array<object>  
        qrCodeName: _this.state.qrCodeName.substring(0,10), // 取10位数字   
        qrCodeNum: _this.state.qrCodeNum, //      
        storeName: _this.state.storeName, // 门店 名称 string  
        terminalList: _this.state.terminalList, // 终端列表  array<object> 
        userId: _this.state.userId, // 
      }

      if (paremes.qrCodeNum === '') { // 确保qrCodeNum和qrCodeName都在传
        paremes.qrCodeName = '';
      }
      // 门店页面信息保存埋点
      const param = {
        eventId: 'H5_agentSign_storeTerminalSave',
        args: paremes,
      };
      _h5t.track('trackevent', paremes);
      // 保存数据
      const option = {
        url: api.apiUrl.storeTerminalSave,
        data: paremes,
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.post(option).then((data) => {
        window.app.mainView.router.load({
          url: 'p/enterprise-index.html',
          animatePages: true,
          pushState: false,
          query: {
            id: _this.state.applyId
          }
        });
      }).catch((error) => {
        window.app.alert(error.message);
      });
    } else {
      window.app.alert('请填写完整信息！');
    }
  }

  /**
   * 参数校验
   */
  vaildParames() {
    const prames = this.state;
    const _this = this;
    if (prames.terminalList.length === 0 && prames.qrCodeList.length === 0) {
      _this.setState({ isSave: '0' }); // 可以保存
      return;
    }
    for (const ii in prames) {
      if(ii !== 'qrCode' && ii !== 'qrCodeName' && ii !== 'qrCodeNum' && ii !== 'county'  && ii !== 'storeId')
      if (prames[ii] === '') { // 参数没有填写完整
        _this.setState({ isSave: '0' }); // 可以保存
        return;
      }
    }
    _this.setState({ isSave: '1' }); // 可以保存
  }

  render() {
    const county = this.state.province + ' ' + this.state.city + ' ' + this.state.county; 
    return (
      <div className={s.wrapper}>
        <ul className={s.credentialsMessage}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">门店名称</span>
            <input className="fr" type="text" value={this.state.storeName} onChange={this.storeNameChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">门店联系人</span>
            <input className="fr" type="text" value={this.state.contact} onChange={this.contactChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">联系电话</span>
            <input className="fr" value={this.state.mobile} onChange={this.mobileChange} type="text" />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">所在地区</span>
            <input className={`fr ${s.selectOption}`} readOnly value={county} onClick={this.countySelect} type="text" />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">详细地址</span>
            <input className="fr" value={this.state.addr} onChange={this.addrChange} type="text" />
          </li>
        </ul>
        <ul className={s.credentialsMessage} style={{ marginTop: '20px' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">请上传门店照片</span>
            <i className={s.descriptionMark} onClick={this.storeMasking}>&nbsp;</i>
          </li>
          <ul className={`clearfix ${s.uploadWrpper}`}>
            <li className={`fl ${s.uploadItem}`}>
              <span>+</span>
              <img className="overDoorImg" alt="" style={{ display: 'none' }} />
              <i>门头照片</i>
              <input id="upload" className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="1" onChange={this.imgUploadChange} />
            </li>
            <li className={`fl ${s.uploadItem}`}>
              <span>+</span>
              <img className="checkStandImg" alt="" style={{ display: 'none' }} />
              <i>内景收银台</i>
              <input id="upload" className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="2" onChange={this.imgUploadChange} />
            </li>
          </ul>
        </ul>
        <ul className={s.credentialsMessage} style={{ marginTop: '20px' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">新增台卡付</span>
          </li>
          <li className={s.inputNumWrap}>
            <input type="button" value={this.state.qrCodeNum} placeholder="扫一扫获取台卡编码" onClick={this.scanQRCode} />
          </li>
           <ul className={`clearfix ${s.terminal}`}>
            {
              this.state.qrCodeList.map((item, rowIndex) => {
                return (
                  <li keys={rowIndex} className={`fl ${s.terminalItem}`}>
                    <i className="ell">{item.qrName}</i>
                    <span className={this.state.deleteMark === '1' ? `show ${s.deleteMark}` : 'hide'} data-name={item.qrName} onClick={this.deleteMarkClick}>&nbsp;</span>
                  </li>
                );
              })
            }
            <li className={`fl ${s.terminalItem}`} onClick={this.storeTerminal}><span className={s.deleteBtn} onClick={this.addCard}>+</span></li>
          </ul>
          <li className={s.credentialItem}>
            <span style={{ color: '#6a9cd9' }} onClick={this.deleteClick}>删除台卡</span>
            <i className="fr" onClick={this.cancleDeleteClick}>取消</i>
          </li>
        </ul>
        <ul className={s.credentialsMessage} style={{ marginTop: '20px' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">新增终端</span>
          </li>
          <ul className={`${s.addTerWrpper}`}>
            <li className={`clearfix ${s.terItem}`}>
              <i className="fl">&nbsp;</i>
              <div className={`fl ${s.terMsg} clearfix`}>
                <span className={`fl ${s.terName}`}>移动POS</span>
                <i className={s.descriptionMark} data-type="ydPosMark" onClick={this.posDesMark}>&nbsp;</i>
                <span className={`fr ${s.terNum}`}>
                  {this.state.ydPosNum}
                  <span className={s.mulit} data-terminalType="2" onClick={this.mulitNum}>-</span>
                  <span className={s.add} data-terminalType="2" onClick={this.addNum}>+</span>
                </span>
              </div>
            </li>
            <li className={`clearfix ${s.terItem}`}>
              <i className={`fl ${s.gwpos}`}>&nbsp;</i>
              <div className={`fl ${s.terMsg} clearfix`}>
                <span className={`fl ${s.terName}`}>固网POS</span>
                <i className={s.descriptionMark} data-type="gwPosMark" onClick={this.posDesMark}>&nbsp;</i>
                <span className={`fr ${s.terNum}`}>
                  {this.state.gwPosNum}
                  <span className={s.mulit} data-terminalType="1" onClick={this.mulitNum}>-</span>
                  <span className={s.add} data-terminalType="1" onClick={this.addNum}>+</span>
                </span>
              </div>
            </li>
            <li className={`clearfix ${s.terItem}`}>
              <i className={`fl ${s.jypos}`}>&nbsp;</i>
              <div className={`fl ${s.terMsg} clearfix`}>
                <span className={`fl ${s.terName}`}>简易POS</span>
                <i className={s.descriptionMark} data-type="jyPosMark" onClick={this.posDesMark}>&nbsp;</i>
                <span className={`fr ${s.terNum}`}>
                  {this.state.jyPosNum}
                  <span className={s.mulit} data-terminalType="3" onClick={this.mulitNum}>-</span>
                  <span className={s.add} data-terminalType="3" onClick={this.addNum}>+</span>
                </span>
              </div>
            </li>
            <li className={`clearfix ${s.terItem}`}>
              <i className={`fl ${s.kqs}`}>&nbsp;</i>
              <div className={`fl ${s.terMsg} clearfix`}>
                <span className={`fl ${s.terName}`}>快钱刷</span>
                <i className={s.descriptionMark} data-type="kqsMark" onClick={this.posDesMark}>&nbsp;</i>
                <span className={`fr ${s.terNum}`}>
                  {this.state.kqsNum}
                  <span className={s.mulit} data-terminalType="5" onClick={this.mulitNum}>-</span>
                  <span className={s.add} data-terminalType="5" onClick={this.addNum}>+</span>
                </span>
              </div>
            </li>
            <li className={`clearfix ${s.terItem}`}>
              <i className={`fl ${s.qkf}`}>&nbsp;</i>
              <div className={`fl ${s.terMsg} clearfix`}>
                <span className={`fl ${s.terName}`}>轻快付</span>
                <i className={s.descriptionMark} data-type="qkfMark" onClick={this.posDesMark}>&nbsp;</i>
                <span className={`fr ${s.terNum}`}>
                  {this.state.qkfNum}
                  <span className={s.mulit} data-terminalType="6" onClick={this.mulitNum}>-</span>
                  <span className={s.add} data-terminalType="6" onClick={this.addNum}>+</span>
                </span>
              </div>
            </li>
          </ul>
        </ul>
        <div className={s.btnWrapper}>
          <button className={this.state.isSave === '1' ? `${s.save}` : null} onClick={this.saveBtn}>保存</button>
        </div>
      </div>
    );
  }
}

export default StoreTerminal;
