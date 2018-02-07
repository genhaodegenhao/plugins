import React from 'react';
import utils from '../../../utils/utils.js';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import s from './enterprise-inf.less';
import _h5t from '../../../utils/h5t.js';


class EnterpriseInf extends React.Component {
  constructor(props) {
    super(props);
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const disabled = sessionStorage.getItem('disabled');
    this.state = {
      applyId: '', // 存储id
      idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
      merchantName: '', // 企业名称
      businessRegno: '', // 营业执照号
      legalName: '', // 法人姓名
      legalId: '', // 身份证号
      cardExpireDateStartStr: '', // 身份证有效期开始时间
      cardExpireDateEndStr: '', // 身份证有效期结束时间
      industryParentType: '', // 行业大类
      industryParentTypeDesc: '', // 行业大类描述
      industrySubType: '', // 行业小类
      industrySubTypeDesc: '', // 行业小类描述
      mccCode: '',
      constraintBusiness: '', // 约定业务  
      accountName: '', // 快钱账号
      mobilephone: '', // 法人手机号
      contactsName: dataList.operatorName ? dataList.operatorName : '', // 调单联系人
      contactsMobile: dataList.mobile ? dataList.mobile : '', // 调单人手机号
      contactsEmail: dataList.email ? dataList.email : '', // 调单人邮箱
      isUniformSocialCredit: '1', // 是否三证合一,1 是 0 否
      qualificationList: [], // 资质列表
      userId: sessionStorage.getItem('userid'), // userId
      isNext: '0', // 下一步可以点击
      industryList: [], // 行业列表
      businessLicense: '', // 营业执照是否上传
      idCardFront: '', // 身份证正面是否上传
      idCardObverse: '', // 身份证反面是否上传
      disable: disabled, // 禁止输入
    };
    this.swicthClick = this.swicthClick.bind(this);
    this.merchantNameChange = this.merchantNameChange.bind(this);
    this.imgUploadChange = this.imgUploadChange.bind(this);
    this.businessRegnoChange = this.businessRegnoChange.bind(this);
    this.legalNameChange = this.legalNameChange.bind(this);
    this.legalIdChange = this.legalIdChange.bind(this);
    this.cardExpireDateStrChange = this.cardExpireDateStrChange.bind(this);
    this.constraintBusinessChange = this.constraintBusinessChange.bind(this);
    this.accountNameChange = this.accountNameChange.bind(this);
    this.mobilephoneChange = this.mobilephoneChange.bind(this);
    this.contactsNameChange = this.contactsNameChange.bind(this);
    this.contactsMobileChange = this.contactsMobileChange.bind(this);
    this.contactsEmailChange = this.contactsEmailChange.bind(this);
    this.checkPrames = this.checkPrames.bind(this);
    this.getData = this.getData.bind(this);
    this.saveBtn = this.saveBtn.bind(this);
    this.nextBtn = this.nextBtn.bind(this);
    this.industryTypeSelected = this.industryTypeSelected.bind(this);

    this.downLoadImage = this.downLoadImage.bind(this);
    this.filterQualificationList = this.filterQualificationList.bind(this);
    this.vaildIdCard = this.vaildIdCard.bind(this);
    this.vaildEmial = this.vaildEmial.bind(this);
    this.vaildEmialKq = this.vaildEmialKq.bind(this);
    this.vaildPhone = this.vaildPhone.bind(this);
  }

  componentDidMount() {
    const _this = this;
    if (sessionStorage.getItem('applyId')) {
      _this.setState({
        applyId: sessionStorage.getItem('applyId'),
      });
    }
    const pages = window.app.onPageInit('p/enterprise-inf.html', (page) => {
      if (page.query && page.query.id) { // 有查询参数
        _this.setState({
          applyId: page.query.id,
        }, () => {
          _this.getData(page.query.id); // 编辑时请求数据
          pages.remove();
        });
      }
    });
    /* eslint-disable */
    const calendar = new LCalendar();
    const calendarEnd = new LCalendar();

    // 开始时间初始化
    calendar.init({
      'trigger': '#cardStartEnd', // 标签id
      'type': 'date', // date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'maxDate': _this.state.cardExpireDateEndStr, // 最大日期
      onChange:function(e) {
        _this.setState({ 
          cardExpireDateStartStr: e.target.value 
        }, () => {
          calendarEnd.minDate(_this.state.cardExpireDateStartStr);
          _this.checkPrames(); //验证
        });
      }
    });

    // 结束事件初始化
    calendarEnd.init({
      'trigger': '#cardEndDate', // 标签id
      'type': 'date', // date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'minDate': _this.state.cardExpireDateStartStr, // 最小日期
      onChange:function(e) {
        _this.setState({ 
          cardExpireDateEndStr: e.target.value 
        }, () => {
          calendar.maxDate(_this.state.cardExpireDateEndStr);
          _this.checkPrames(); //验证
        });
      }
    });
    // 查询行业类型数据
    const option = {
      url: api.apiUrl.industryList,
      data: {},
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.post(option).then((data) => {
      if (data.data.length) {
        _this.setState({
          industryList: data.data,
        });
      }
    }).catch((error) => {
      console.log(error);
    });

    // 页面埋点
    const params = {
      eventId: 'H5_agentSign_P_enterpriseInf',
    };
    _h5t.track('pageview', params);
  }

  getData(id) {
    console.log(id);
    // 接口获取数据
    console.log(this);
    console.log(id);
    const _this = this;
    const option = {
      url: api.apiUrl.applyPageInfo,
      data: {
        applyId: id,
        pageType: 'mlQyzj',
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.post(option).then((data) => {
      console.log(data);
      _this.setState({
        merchantName: data.data.merchantName, // 企业名称
        businessRegno: data.data.businessRegno, // 营业执照号
        legalName: data.data.legalName, // 法人姓名
        legalId: data.data.legalId, // 身份证号
        cardExpireDateEndStr: data.data.cardExpireDateEndStr,
        cardExpireDateStartStr: data.data.cardExpireDateStartStr,
        industryParentType: data.data.industryParentType, // 行业大类
        industryParentTypeDesc: data.data.industryParentTypeDesc, // 行业大类描述
        industrySubType: data.data.industrySubType, // 行业小类
        industrySubTypeDesc: data.data.industrySubTypeDesc, // 行业小类描述
        mccCode: data.data.mccCode,
        constraintBusiness: data.data.constraintBusiness, // 约定业务  
        accountName: data.data.accountName, // 快钱账号
        mobilephone: data.data.mobilephone, // 法人手机号
        contactsName: data.data.contactsName, // 调单联系人
        contactsMobile: data.data.contactsMobile, // 调单人手机号
        contactsEmail: data.data.contactsEmail, // 调单人邮箱
        isUniformSocialCredit: data.data.isUniformSocialCredit, // 是否三证合一,1 是 0 否
        qualificationList: data.data.qualificationList, // 资质列表
        isQualificationList: data.data.qualificationList, // 资质列表
        businessLicense: '1', // 营业执照是否上传
        idCardFront: '1', // 身份证正面是否上传
        idCardObverse: '1', // 身份证反面是否上传
      }, () => {
        _this.downLoadImage();
        _this.checkPrames();
      });
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 下载图片
   */
  /* eslint-disable */
  downLoadImage() {
    this.state.qualificationList.map((item, index) => {
      console.log(index);
      const fileType = item.fileType;
      const id = item.fssId;
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
        let img = null;
        if (fileType === '1') {
          img = window.$$('.page-on-center .businessLicense');
        } else if (fileType === '2') {
          img = window.$$('.page-on-center .idCardFront');
        } else if (fileType === '23') {
          img = window.$$('.page-on-center .idCardObverse');
        } else if (fileType === '5') {
          img = window.$$('.page-on-center .openingPermit');
        } else if (fileType === '6') {
          img = window.$$('.page-on-center .businOrgCodeCer');
        } else if (fileType === '7') {
          img = window.$$('.page-on-center .taxRegCer');
        }
        img.attr('src', data.data.imageBase64);
        img.show();
        img.prev('span').hide();
      }).catch((error) => {
        window.app.alert(error.message);
      });
    });
  }
  /**
   *  开关点击
   */
  swicthClick() {
    const _this = this;
    const isUniformSocialCredit = this.state.isUniformSocialCredit;
    if (isUniformSocialCredit === '1') {
      this.setState({ isUniformSocialCredit: '0' });
    } else {
      this.setState({ isUniformSocialCredit: '1' });
    }
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   *  企业名称change
   */
  merchantNameChange(e) {
    const _this = this;
    this.setState({ merchantName: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 营业执照号change
   */
  businessRegnoChange(e) {
    const _this = this;
    this.setState({ businessRegno: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 法人姓名change
   */
  legalNameChange(e) {
    const _this = this;
    this.setState({ legalName: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 法人身份证号change
   */
  legalIdChange(e) {
    const _this = this;
    this.setState({ legalId: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 身份证校验
   */
  vaildIdCard(e) {
    console.log(this);
    const value = e.target.value;
    if (!utils.vaildCard(value)) {
      window.app.alert('请输入正确的身份证！');
    }
  }
  /**
   * 法人身份证有效期change
   */
  cardExpireDateStrChange(e) {
    const _this = this;
    this.setState({ cardExpireDateStr: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 约定业务change
   */
  constraintBusinessChange(e) {
    const _this = this;
    this.setState({ constraintBusiness: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 快钱账号change
   */
  accountNameChange(e) {
    const _this = this;
    this.setState({ accountName: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 快钱账号校验
   */
  vaildEmialKq(e) {
    console.log(this);
    const value = e.target.value;
    if (!utils.vaildEmial(value)) {
      window.app.alert('请输入正确的邮箱！');
      return;
    }
    if (value.split('@')[1] === '99bill.com') {
      window.app.alert('不支持99bill的邮箱！');
      return;
    }
  }
  /**
   * 法人手机号change
   */
  mobilephoneChange(e) {
    const _this = this;
    this.setState({ mobilephone: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 手机验证号
   */
  vaildPhone(e) {
    console.log(this);
    const value = e.target.value;
    if (!utils.vaildPhoneNum(value)) {
      window.app.alert('请输入正确的手机号！');
      return;
    }
  }
  /**
   * 调单人姓名change
   */
  contactsNameChange(e) {
    const _this = this;
    this.setState({ contactsName: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 调单人手机号hange
   */
  contactsMobileChange(e) {
    const _this = this;
    this.setState({ contactsMobile: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 调单人邮箱change
   */
  contactsEmailChange(e) {
    const _this = this;
    this.setState({ contactsEmail: e.target.value });
    setTimeout(() => {
      _this.checkPrames();
    }, 0);
  }

  /**
   * 邮箱验证
   */
  vaildEmial(e) {
    console.log(this);
    const value = e.target.value;
    if (!utils.vaildEmial(value)) {
      window.app.alert('请输入正确的邮箱！');
    }
  }

  /**
   * 图片上传change
   */
  imgUploadChange(e) {
    const _this = this;
    console.log(_this);
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
    console.log(extensionName);

    if (fileType === '1') { // 营业执照上传
      const img = window.$$('.page-on-center  .businessLicense');
      const fileThis = file;
      const ocrType = e.target.getAttribute('data-ocr');
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        if( ocrType !== 'false') {
          utils.imgUpload(fileThis).then((res) => {
            img.show();
            img.prev('span').hide();
            const obj = {
              fileType: '1',
              fssId: res,
              fileName: fileThis.files[0].name,
              imageType: fileThis.value.split('.')[1],
            };
            const qualificationList = _this.filterQualificationList(fileType);
            qualificationList.push(obj);
            _this.setState({
              qualificationList: qualificationList,
              businessLicense: '1',
            }); //eslint-disable-line 
            setTimeout(() => {
              _this.checkPrames();
            }, 0);
            return utils.ocrRecognize('businessLicense', res);
          }).then((res) => { // ocr识别
            _this.setState({
              merchantName: res.名称, // 企业名称
              businessRegno: res.统一社会信用代码, // 营业执照号
              legalName: res.法定代表人, // 法人姓名
            }); //eslint-disable-line
          });
        }else {
          utils.imgUpload(fileThis).then((res) => {
            img.show();
            img.prev('span').hide();
            const obj = {
              fileType: '1',
              fssId: res,
              fileName: fileThis.files[0].name,
              imageType: fileThis.value.split('.')[1],
            };
            const qualificationList = _this.filterQualificationList(fileType);
            qualificationList.push(obj);
            _this.setState({
              qualificationList: qualificationList,
              businessLicense: '1',
            }); //eslint-disable-line 
            setTimeout(() => {
              _this.checkPrames();
            }, 0);
          })
        }
      };
    } else if (fileType === '2') { // 身份证正面
      const img = window.$$('.page-on-center .idCardFront');
      const fileThis = file;
      const ocrType = e.target.getAttribute('data-ocr');
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        if(ocrType !== 'false') {
          utils.imgUpload(fileThis).then((res) => {
            img.show();
            img.prev('span').hide();
            const obj = {
              fileType: '2',
              fssId: res,
              fileName: fileThis.files[0].name,
              imageType: fileThis.value.split('.')[1],
            };
            const qualificationList = _this.filterQualificationList(fileType);
            qualificationList.push(obj);
            _this.setState({
              qualificationList: qualificationList,
              idCardFront: '0',
            }); //eslint-disable-line 
            setTimeout(() => {
              _this.checkPrames();
            }, 0);
            return utils.ocrRecognize('idCard', res);
          }).then((res) => { // ocr识别
            _this.setState({ legalId: res.idno }); //eslint-disable-line
          });
        } else {
          utils.imgUpload(fileThis).then((res) => {
            img.show();
            img.prev('span').hide();
            const obj = {
              fileType: '2',
              fssId: res,
              fileName: fileThis.files[0].name,
              imageType: fileThis.value.split('.')[1],
            };
            const qualificationList = _this.filterQualificationList(fileType);
            qualificationList.push(obj);
            _this.setState({
              qualificationList: qualificationList,
              idCardFront: '0',
            }); //eslint-disable-line 
            setTimeout(() => {
              _this.checkPrames();
            }, 0);
          })
        }
      }
    } else if (fileType === '23') { // 身份证反面
      const img = window.$$('.page-on-center .idCardObverse');
      const fileThis = file;
      const ocrType = e.target.getAttribute('data-ocr');
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        if(ocrType !== 'false') {
          utils.imgUpload(fileThis).then((res) => {
            img.show();
            img.prev('span').hide();
            const obj = {
              fileType: '23',
              fssId: res,
              fileName: fileThis.files[0].name,
              imageType: fileThis.value.split('.')[1],
            };
            const qualificationList = _this.filterQualificationList(fileType);
            qualificationList.push(obj);
            _this.setState({
              qualificationList: qualificationList,
              idCardObverse: '1',
            }); //eslint-disable-line 
            setTimeout(() => {
              _this.checkPrames();
            }, 0);
            return utils.ocrRecognize('idCard', res);
          }).then((res) => { // ocr识别
            const str = res.validthru.split('-');
            const starTime = str[0].substring(0,4) + '-' + str[0].substring(4,6) + '-' + str[0].substring(6,8);
            const endTime = str[1].substring(0,4) + '-' + str[1].substring(4,6) + '-' + str[1].substring(6,8);
            _this.setState({
              cardExpireDateStartStr: starTime, // 身份证有效期开始时间
              cardExpireDateEndStr: endTime, // 身份证有效期结束时间
            }); //eslint-disable-line
          });
        } else {
          utils.imgUpload(fileThis).then((res) => {
            img.show();
            img.prev('span').hide();
            const obj = {
              fileType: '23',
              fssId: res,
              fileName: fileThis.files[0].name,
              imageType: fileThis.value.split('.')[1],
            };
            const qualificationList = _this.filterQualificationList(fileType);
            qualificationList.push(obj);
            _this.setState({
              qualificationList: qualificationList,
              idCardObverse: '1',
            }); //eslint-disable-line 
            setTimeout(() => {
              _this.checkPrames();
            }, 0);
          });
        }
      };
    } else if (fileType === '5') { // 开户许可证
      const img = window.$$('.page-on-center .openingPermit');
      const fileThis = file;
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        utils.imgUpload(fileThis).then((res) => {
          img.show();
          img.prev('span').hide();
          const obj = {
            fileType: '5',
            fssId: res,
            fileName: fileThis.files[0].name,
            imageType: fileThis.value.split('.')[1],
          };
          const qualificationList = _this.filterQualificationList(fileType);
          qualificationList.push(obj);
          setTimeout(() => {
            _this.checkPrames();
          }, 0);
          _this.setState({
            qualificationList: qualificationList,
            openingPermit: true,
          }); //eslint-disable-line
        });
      };
    } else if (fileType === '6') { // 组织机构代码证
      const img = window.$$('.page-on-center .businOrgCodeCer');
      const fileThis = file;
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        utils.imgUpload(fileThis).then((res) => {
          img.show();
          img.prev('span').hide();
          const obj = {
            fileType: '6',
            fssId: res,
            fileName: fileThis.files[0].name,
            imageType: fileThis.value.split('.')[1],
          };
          const qualificationList = _this.filterQualificationList(fileType);
          qualificationList.push(obj);
          _this.setState({ qualificationList: qualificationList }); //eslint-disable-line
          setTimeout(() => {
            _this.checkPrames();
          }, 0);
        });
      };
    } else if (fileType === '7') { // 税务登记证
      const img = window.$$('.page-on-center .taxRegCer');
      const fileThis = file;
      reader.readAsDataURL(file.files[0]);
      reader.onload = function () {
        img.attr('src', this.result);
        utils.imgUpload(fileThis).then((res) => {
          img.show();
          img.prev('span').hide();
          const obj = {
            fileType: '7',
            fssId: res,
            fileName: fileThis.files[0].name,
            imageType: fileThis.value.split('.')[1],
          };
          const qualificationList = _this.filterQualificationList(fileType);
          qualificationList.push(obj);
          _this.setState({ qualificationList: qualificationList }); //eslint-disable-line
          setTimeout(() => {
            _this.checkPrames();
          }, 0);
        });
      };
    }
  }

  /**
   * 筛选数据
   */
  filterQualificationList(fileType) {
    const _this = this;
    const qualificationList = _this.state.qualificationList;
    for(let i = 0; i < qualificationList.length; i++) { // 从数组中删除
      if (qualificationList[i].fileType === fileType) {
        qualificationList.splice(i,1);
        break;
      }
    }
    return qualificationList;
  }

  /* eslint-disable */
  /**
   * 校验数据
   */
  checkPrames() {
    const prames = this.state;
    const _this = this;
    for (const ii in prames) {
      if (ii !== 'applyId') {
        if (prames[ii] === '') { // 参数没有填写完整
          _this.setState({ isNext: '0' }); // 可以保存
          return;
        }
      }
    }
    _this.setState({ isNext: '1' }); // 可以保存
  }

  /* eslint-disable */
  /**
   * 行业类型选择
   */
  industryTypeSelected(e) {
    const _this = this;
    new Picker({
      'title': '请选择行业类型', // 标题(可选)
      'defaultValue': e.target.value, // 默 认值-多个以空格分开（可选）
      'type': 2, //  需要联动级数[1、2、3]（可选）
      'data': _this.state.industryList,//数据(必传)
      'keys': {
          'id': 'industryCode',
          'value': 'industryDesc', 
          'childData': 'list', // 最多3级联动
      }, // 数组内的键名称(必传，id、text、data)
      'callBack': function (val,code) {
        // 回调函数（val为选择的值）
        const industryParentType = val.split(' ')[0]; // 行业大类
        const industrySubType = val.split(' ')[1]; // 行业小类
        this.data.map((item,index) => {
          if(item.industryDesc === industryParentType) {
            _this.setState({
              industryParentTypeDesc: industryParentType,
              industryParentType: item.industryCode,
            });
            item.list.map((val, i) => {
              if(val.industryDesc === industrySubType) {
                _this.setState({
                  industrySubType: val.industryCode,
                  industrySubTypeDesc: val.industryDesc,
                  mccCode: val.mcc,
                });
              }
            });
          }
        });
        setTimeout(() => {
          _this.checkPrames();
        }, 0);
      }
    });
  }

  /**
   * 保存数据
   */
  saveBtn() {
    const _this = this;
    if (_this.state.isNext === '1') {
      const paremes = {
        applyId: sessionStorage.getItem('applyId'), // 存储id
        idContent: _this.state.idContent,
        merchantName: _this.state.merchantName, // 企业名称
        businessRegno: _this.state.businessRegno, // 营业执照号
        legalName: _this.state.legalName, // 法人姓名
        legalId: _this.state.legalId, // 身份证号
        cardExpireDateStartStr: _this.state.cardExpireDateStartStr, // 身份证有效期开始时间
        cardExpireDateEndStr: _this.state.cardExpireDateEndStr, // 身份证有效期结束时间
        industryParentType: _this.state.industryParentType, // 行业大类
        industryParentTypeDesc: _this.state.industryParentTypeDesc, // 行业大类描述
        industrySubType: _this.state.industrySubType, // 行业小类
        industrySubTypeDesc: _this.state.industrySubTypeDesc, // 行业小类描述
        mccCode: _this.state.mccCode,
        constraintBusiness: _this.state.constraintBusiness, // 约定业务  
        accountName: _this.state.accountName, // 快钱账号
        mobilephone: _this.state.mobilephone, // 法人手机号
        contactsName: _this.state.contactsName, // 调单联系人
        contactsMobile: _this.state.contactsMobile, // 调单人手机号
        contactsEmail: _this.state.contactsEmail, // 调单人邮箱
        isUniformSocialCredit: _this.state.isUniformSocialCredit, // 是否三证合一,1 是 0 否
        qualificationList: _this.state.qualificationList, // 资质列表
        userId: _this.state.userId,
      }
      sessionStorage.setItem('enterpriseInfParames', JSON.stringify(paremes));
      console.log(paremes);

      // 企业进件信息保存埋点
      const params = {
        eventId: 'H5_agentSign_enterpriseInfSave',
        args: paremes,
      };
      _h5t.track('trackevent', params);
      // 保存数据
      const option = {
        url: api.apiUrl.companyCertifiSave,
        data: paremes,
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.post(option).then((data) => {
        sessionStorage.setItem('applyId', data.data.applyId);
        window.app.mainView.router.load({
          url: 'p/enterprise-index.html',
          animatePages: true,
          pushState: false,
          query: {
            id: data.data.applyId
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
   * 下一步
   */
  nextBtn() {
    const _this = this; 
    if(_this.state.isNext === '1') {
      const paremes = {
        applyId: sessionStorage.getItem('applyId'), // 存储id
        idContent: _this.state.idContent,
        merchantName: _this.state.merchantName, // 企业名称
        businessRegno: _this.state.businessRegno, // 营业执照号
        legalName: _this.state.legalName, // 法人姓名
        legalId: _this.state.legalId, // 身份证号
        cardExpireDateStartStr: _this.state.cardExpireDateStartStr, // 身份证有效期开始时间
        cardExpireDateEndStr: _this.state.cardExpireDateEndStr, // 身份证有效期结束时间
        industryParentType: _this.state.industryParentType, // 行业大类
        industryParentTypeDesc: _this.state.industryParentTypeDesc, // 行业大类描述
        industrySubType: _this.state.industrySubType, // 行业小类
        industrySubTypeDesc: _this.state.industrySubTypeDesc, // 行业小类描述
        mccCode: _this.state.mccCode,
        constraintBusiness: _this.state.constraintBusiness, // 约定业务  
        accountName: _this.state.accountName, // 快钱账号
        mobilephone: _this.state.mobilephone, // 法人手机号
        contactsName: _this.state.contactsName, // 调单联系人
        contactsMobile: _this.state.contactsMobile, // 调单人手机号
        contactsEmail: _this.state.contactsEmail, // 调单人邮箱
        isUniformSocialCredit: _this.state.isUniformSocialCredit, // 是否三证合一,1 是 0 否
        qualificationList: _this.state.qualificationList, // 资质列表
        userId: _this.state.userId,
      }
      sessionStorage.setItem('enterpriseInfParames',JSON.stringify(paremes));
      // 企业进件信息下一步埋点
      const params = {
        eventId: 'H5_agentSign_enterpriseInfNext',
        args: paremes,
      };
      _h5t.track('trackevent', params);
      // 保存数据
      const option = {
        url: api.apiUrl.companyCertifiSave,
        data: paremes,
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.post(option).then((data) => {
        $$('#startDate').remove();
        $$('#endDate').remove();
        sessionStorage.setItem('applyId', data.data.applyId);
        window.app.mainView.router.load({
          url: 'p/credit-inf.html',
          animatePages: true,
          pushState: false,
          query: {
            id: data.data.applyId
          }
        });
      }).catch((error) => {
        window.app.alert(error.message);
      });
    }else {
      window.app.alert('请填写完整信息！');
    }
  }

  render() {
    const hangyeType = this.state.industryParentTypeDesc + ' ' + this.state.industrySubTypeDesc;
    return (
      <div className={s.wrapper}>
        <ul className={s.credentialsMessage}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">企业名称</span>
            <input className="fr" disabled={this.state.disable ? `disabled` : null} type="text" value={this.state.merchantName} onChange={this.merchantNameChange} placeholder="拍摄营业执照可自动识别" /> 
            <i className={s.cameraOption}>&nbsp;</i>
            <input id="uploadMerchant" disabled={this.state.disable ? `disabled` : null} className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="1" onChange={this.imgUploadChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">注册号/信用代码</span>
            <input className="fr" type="text"disabled={this.state.disable ? `disabled` : null} value={this.state.businessRegno} placeholder="请输入营业执照号/信用代码" onChange={this.businessRegnoChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">法人姓名</span>
            <input className="fr" type="text" disabled={this.state.disable ? `disabled` : null} value={this.state.legalName} placeholder="请输入法人/负责人姓名" onChange={this.legalNameChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">身份证号</span>
            <input className="fr" type="text"disabled={this.state.disable ? `disabled` : null} value={this.state.legalId} placeholder="拍摄身份证可自动识别" onChange={this.legalIdChange} onBlur={this.vaildIdCard} />
            <i className={s.cameraOption}>&nbsp;</i>
            <input id="uploadLegalId" disabled={this.state.disable ? `disabled` : null} className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="2" onChange={this.imgUploadChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">身份证开始时间</span>
            <input id="cardStartEnd" disabled={this.state.disable ? `disabled` : null} className="fr" type="text" readOnly value={this.state.cardExpireDateStartStr} placeholder="请输入身份证有效期开始时间" />
            <i className={s.cameraOption}>&nbsp;</i>
            <input id="uploadCardExpire" disabled={this.state.disable ? `disabled` : null} className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="23" onChange={this.imgUploadChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">身份证结束时间</span>
            <input id="cardEndDate" readOnly disabled={this.state.disable ? `disabled` : null} className="fr" type="text" readOnly placeholder="请输入身份证有效期结束时间" value={this.state.cardExpireDateEndStr} />
          </li>
          <li className={`clearfix ${s.credentialItem}`} onClick={this.industryTypeSelected}>
            <span className="fl">行业类型</span>
            <input className="fr" value={hangyeType} type="text" readOnly placeholder="请选择行业" />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">约定业务</span>
            <input className="fr" type="text" value={this.state.constraintBusiness} placeholder="请输入实际经营业务" onChange={this.constraintBusinessChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">快钱账户</span>
            <input className="fr" disabled={this.state.disable ? `disabled` : null} type="text" value={this.state.accountName} placeholder="请输入邮箱地址" onChange={this.accountNameChange} onBlur={this.vaildEmialKq} />
          </li>
          <li className={`clearfix ${s.credentialItem}`} style={{ border: 'none' }}>
            <span className="fl">法人手机号</span>
            <input className="fr" text="text" value={this.state.mobilephone} placeholder="请输入法人手机号" onChange={this.mobilephoneChange} onBlur={this.vaildPhone} />
          </li>
        </ul>
        <ul className={s.credentialsMessage} style={{ marginTop: '20px' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">调单联系人</span>
            <input className="fr" type="text" value={this.state.contactsName} onChange={this.contactsNameChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">调单人手机</span>
            <input className="fr" type="text" value={this.state.contactsMobile} onChange={this.contactsMobileChange} onBlur={this.vaildPhone} />
          </li>
          <li className={`clearfix ${s.credentialItem}`} style={{ border: 'none' }}>
            <span className="fl">调单人邮箱</span>
            <input className="fr" type="text" value={this.state.contactsEmail} onChange={this.contactsEmailChange} onBlur={this.vaildEmial} />
          </li>
        </ul>
        <ul className={s.credentialsMessage} style={{ marginTop: '20px' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">三证合一</span>
            <span className={this.state.isUniformSocialCredit === '1' ? `fr ${s.swicthBox} ${s.open1}` : `fr ${s.swicthBox} ${s.close1}`} onClick={this.swicthClick}>
              <span className={this.state.isUniformSocialCredit === '1' ? `${s.swicthItem} ${s.open2}` : `${s.swicthItem} ${s.close2}`}>&nbsp;</span>
            </span>
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">请上传以下资质</span>
          </li>
          <ul className={`clearfix ${s.uploadWrpper}`}>
            <li className={`fl ${s.uploadItem}`}>
              <span>+</span>
              <img className="businessLicense" src="" alt="" style={{ display: 'none' }} />
              <i>营业执照</i>
              <input className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="1" data-ocr="false" onChange={this.imgUploadChange} />
            </li>
            <li className={`fl ${s.uploadItem}`}>
              <span>+</span>
              <img className="idCardFront" alt="" style={{ display: 'none' }} />
              <i>身份证正面</i>
              <input className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="2" data-ocr="false" onChange={this.imgUploadChange} />
            </li>
            <li className={`fl ${s.uploadItem}`} style={{ marginRight: '0' }}>
              <span>+</span>
              <img className="idCardObverse" alt="" style={{ display: 'none' }} />
              <i>身份证反面</i>
              <input className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="23" data-ocr="false" onChange={this.imgUploadChange} />
            </li>
            <li className={`fl ${s.uploadItem}`}>
              <span>+</span>
              <img className="openingPermit" alt="" style={{ display: 'none' }} />
              <i>开户许可证</i>
              <input className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="5" onChange={this.imgUploadChange} />
            </li>
            <li className={this.state.isUniformSocialCredit === '0' ? `fl ${s.uploadItem}` : 'hide'}>
              <span>+</span>
              <img className="businOrgCodeCer" alt="" style={{ display: 'none' }} />
              <i>组织机构代码证</i>
              <input className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="6" onChange={this.imgUploadChange} />
            </li>
            <li className={this.state.isUniformSocialCredit === '0' ? `fl ${s.uploadItem}` : 'hide'} style={{ marginRight: '0' }}>
              <span>+</span>
              <img className="taxRegCer" alt="" style={{ display: 'none' }} />
              <i>税务登记证</i>
              <input className={s.uploadInput} name="upload" type="file" accept="image/*" data-fileType="7" onChange={this.imgUploadChange} />
            </li>
          </ul>
        </ul>
        <div className={s.btnWrapper}>
          <button onClick={this.saveBtn}>保存草稿</button>
          <button className={this.state.isNext === '1' ? `${s.save} ${s.btnNext}` : `${s.btnNext}`} onClick={this.nextBtn}>下一步</button>
        </div>
      </div>
    );
  }
}

export default EnterpriseInf;
