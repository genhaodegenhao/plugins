import React from 'react';
import utils from '../../../utils/utils.js';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import description from '../../../utils/description.js';
import s from './product-rate-inf.less';
import _h5t from '../../../utils/h5t.js';

class ProductRateInf extends React.Component {
  constructor(props) {
    super(props);
    const enterpriseInfParames = JSON.parse(sessionStorage.getItem('enterpriseInfParames'));
    console.log(enterpriseInfParames);
    this.state = {
      applyId: '', // string  
      idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
      accountName: '', // 结算户名  string  
      bankType: '', // 对公对私  string  1 对私 0 对公 
      acountNo: '', // 结算账户
      bankName: '', // 银行名称  string
      province: '', //  省份  string   
      city: '', // 城市  string  
      bankBranch: '', // 支行  string  
      cpChecked: '1', // Cp产品 是否选中  string  1 是 0 否
      cpCuDebitMaxFee: '', // Cp产品 封顶  string  
      cpCuRateCredit: '', // Cp产品 贷记卡 string  
      cpCuRateDebit: '', // Cp产品 借记卡 string  
      cpIchalfPenny: '0', // Cp产品 小额免密免签  string  1 是 0 否
      cpMaxTxnAmt: '', // Cp产品 单笔限额  string  
      cpSalesDailyQuota: '', // Cp产品 单日限额  string 
      qrAliPay: '', // 扫码 支付宝 string  
      qrChecked: '1', // 扫码 是否选中  string  1 是 0 否
      qrCuDebitMaxFee: '', // 扫码 封顶  string  
      qrCuRateCredit: '', //  扫码 贷记卡 string  
      qrCuRateDebit: '', // 扫码 借记卡 string  
      qrUnionPay: '', // 扫码 银二  string  
      qrUnionPayDiscounts: '', // 扫码 银二小额优惠  string  
      qrWeChat: '', //  扫码 微信  string  
      userId: sessionStorage.getItem('userid'), // userId
      accountNameList: [{ // 结算账户列表
        text: '',
        value: '1',
      }, {
        text: '',
        value: '0',
      }],
      isNext: '0',
      bankBranchShow: '0', // 支行显示
      bankBranchAllList: [], // 支行列表总
      bankBranchList: [], // 支行列表
      provinceCityList: [], // 省市列表
    };
    this.getData = this.getData.bind(this);
    this.cpCheckedClick = this.cpCheckedClick.bind(this);
    this.accountNameClick = this.accountNameClick.bind(this);
    this.selecteBank = this.selecteBank.bind(this);
    this.acountNoChange = this.acountNoChange.bind(this);
    this.accountInputChange = this.accountInputChange.bind(this);
    this.binkCitySelected = this.binkCitySelected.bind(this);
    this.bankBranchChange = this.bankBranchChange.bind(this);

    this.cpCuDebitMaxFeeChange = this.cpCuDebitMaxFeeChange.bind(this);
    this.cpCuRateCreditChange = this.cpCuRateCreditChange.bind(this);
    this.cpCuRateDebitChange = this.cpCuRateDebitChange.bind(this);
    this.cpMaxTxnAmtChange = this.cpMaxTxnAmtChange.bind(this);
    this.cpSalesDailyQuotaChange = this.cpSalesDailyQuotaChange.bind(this);

    this.qrAliPayChange = this.qrAliPayChange.bind(this);
    this.qrCuDebitMaxFeeChange = this.qrCuDebitMaxFeeChange.bind(this);
    this.qrCuRateCreditChange = this.qrCuRateCreditChange.bind(this);
    this.qrCuRateDebitChange = this.qrCuRateDebitChange.bind(this);
    // this.qrUnionPayChange = this.qrUnionPayChange.bind(this);
    this.qrUnionPayDiscountsChange = this.qrUnionPayDiscountsChange.bind(this);
    this.qrWeChatChange = this.qrWeChatChange.bind(this);

    this.selecteCpIchalfPenny = this.selecteCpIchalfPenny.bind(this);
    this.vaildParames = this.vaildParames.bind(this);

    this.saveBtn = this.saveBtn.bind(this);
    this.nextBtn = this.nextBtn.bind(this);
    this.posDesMark = this.posDesMark.bind(this);

    this.getRateList = this.getRateList.bind(this);

    this.inputBlur = this.inputBlur.bind(this);

    this.bankInputBlur = this.bankInputBlur.bind(this);

    this.cancleInput = this.cancleInput.bind(this);

    this.bankBranchList = this.bankBranchList.bind(this);

    this.bankBranchSelected = this.bankBranchSelected.bind(this);

    this.queryLegalAndCompany = this.queryLegalAndCompany.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const pages = window.app.onPageInit('p/product-rate-inf.html', (page) => {
      if (page.query && page.query.id) { // 有查询参数
        _this.setState({
          applyId: page.query.id,
        }, () => {
          pages.remove();
          _this.getRateList();
          _this.queryLegalAndCompany(page.query.id);
        });
      }
    });
    // 查询省市数据
    const option = {
      url: api.apiUrl.zoneList,
      data: {},
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
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
      eventId: 'H5_agentSign_P_productRateInf',
    };
    _h5t.track('pageview', params);
  }

  /**
   * 获取数据
   */
  getData(id) {
    // 接口获取数据
    const _this = this;
    const option = {
      url: api.apiUrl.applyPageInfo,
      data: {
        applyId: id,
        pageType: 'mlCpfl',
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.post(option).then((data) => {
      console.log(data);
      if (data.data) {
        _this.setState({
          accountName: data.data.accountName, // 结算户名  string  
          acountNo: data.data.accountNo, // 银行账号  string 
          bankBranch: data.data.bankBranch, // 支行  string  
          bankName: data.data.bankName, // 银行名称  string  
          bankType: data.data.bankType, // 对公对私  string  1 对私 0 对公
          city: data.data.city, // 城市  string
          cpChecked: data.data.cpProductRate.checked, // 是否选中  string  1 是 0 否
          cpCuDebitMaxFee: data.data.cpProductRate.cuDebitMaxFee, // 封顶  string  
          cpCuRateCredit: data.data.cpProductRate.cuRateCredit, // 贷记卡 string  
          cpCuRateDebit: data.data.cpProductRate.cuRateDebit, // 借记卡 string  
          cpIchalfPenny: data.data.cpProductRate.ichalfPenny, // 小额免密免签  string  1 是 0 否
          cpMaxTxnAmt: data.data.cpProductRate.maxTxnAmt, // 单笔限额  string  
          cpSalesDailyQuota: data.data.cpProductRate.salesDailyQuota, // 单日限额  string
          province: data.data.province, // 省份  string  
          qrAliPay: data.data.qrCodeProductRate.aliPay || '', // 支付宝 string  
          qrChecked: data.data.qrCodeProductRate.checked || '', // 是否选中  string  1 是 0 否
          qrCuDebitMaxFee: data.data.qrCodeProductRate.cuDebitMaxFee || '', // 封顶  string  
          qrCuRateCredit: data.data.qrCodeProductRate.cuRateCredit || '', // 贷记卡 string  
          qrCuRateDebit: data.data.qrCodeProductRate.cuRateDebit || '', // 借记卡 string  
          qrUnionPay: data.data.qrCodeProductRate.unionPay || '', // 银二  string  
          qrUnionPayDiscounts: data.data.qrCodeProductRate.unionPayDiscounts || '', // 银二小额优惠  string  
          qrWeChat: data.data.qrCodeProductRate.weChat || '', // 微信  string
        }, () => {
          _this.vaildParames(); // 验证
        });
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 获取默认费率
   */
  getRateList() {
    const _this = this;
    const option = {
      url: api.apiUrl.queryRateList,
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.get(option).then((data) => {
      console.log(data);
      if (data.data) {
        _this.setState({
          cpCuDebitMaxFee: data.data.cpProduct.cuDebitMaxFee, // 封顶  string  
          cpCuRateCredit: data.data.cpProduct.cuRateCredit, // 贷记卡 string  
          cpCuRateDebit: data.data.cpProduct.cuRateDebit, // 借记卡 string 
          cpMaxTxnAmt: data.data.cpProduct.maxTxnAmt, // 单笔限额  string  
          cpSalesDailyQuota: data.data.cpProduct.salesDailyQuota, // 单日限额  string
          qrAliPay: data.data.qrCodeProduct.aliPay, // 支付宝 string
          qrCuDebitMaxFee: data.data.qrCodeProduct.cuDebitMaxFee, // 封顶  string  
          qrCuRateCredit: data.data.qrCodeProduct.cuRateCredit, // 贷记卡 string  
          qrCuRateDebit: data.data.qrCodeProduct.cuRateDebit, // 借记卡 string  
          qrWeChat: data.data.qrCodeProduct.weChat, // 微信  string
        }, () => {
          _this.getData(_this.state.applyId); // 编辑时请求数据
        });
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 查询结算账户下拉框
   */
  queryLegalAndCompany(id) {
    const _this = this;
    const option = {
      url: api.apiUrl.queryLegalAndCompany,
      data: {
        applyId: id,
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.post(option).then((data) => {
      console.log(data);
      if (data.data) {
        const accountNameList1 = [{ // 结算账户列表
          text: data.data.legalName,
          value: '1',
        }, {
          text: data.data.merchantName,
          value: '0',
        }];
        _this.setState({
          accountNameList: accountNameList1,
        });
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 结算账号选择
   */
  /* eslint-disable */
  accountNameClick() {
    const _this = this;
    new Picker({
      'title': '请选择结算户名',//标题(可选)
      'defaultValue': '',//默认值-多个以空格分开（可选）
      'type': 1,//需要联动级数[1、2、3]（可选）
      'data': _this.state.accountNameList,//数据(必传)
      'keys': {
          'id': 'value',
          'value': 'text',
      },//数组内的键名称(必传，id、text、data)
      'callBack': function (val,code) {
        const accountName = val; // 结算账号
        let bankType = ''; // 对公对私
        this.data.map((item,index) => {
          if(item.text === val) {
            bankType = item.value;
          }
        });
        _this.setState({
          accountName: accountName,
          bankType: bankType,
        }, () => {
          _this.vaildParames(); //验证
        });
      }
    });
  }

  /**
   * 选择银行
   */
  selecteBank() {
    const _this = this;
    window.app.mainView.router.load({
      url: 'p/bank-list.html',
      animatePages: true,
      query: {
        this: _this,
      }
    });
  }

  /**
   * 结算账号上传和识别
   */
  accountInputChange(e) {
    const _this = this;
    const file = e.target;
    const reader = new FileReader();
    const fileThis = file;
    reader.readAsDataURL(file.files[0]);
    reader.onload = function () {
      utils.imgUpload(fileThis).then((res) => {
        return utils.ocrRecognize('bankCard', res);
      }).then((res) => { // ocr识别
        _this.setState({ acountNo: res.cardno }, () => {
          _this.vaildParames(); //验证
          _this.bankCardBinCheck(); // 卡bin校验
        });
      });
    };
  }

  /**
   * inpu失去焦点
   */
  inputBlur(e) {
    console.log(this);
    const value = e.target.value;
    if (value !== '') {
      if (!utils.vaildNum(value)) {
        window.app.alert('请输入数字！');
      }
    }
  }
  /**
   * 银行卡号change
   */
  acountNoChange(e) {
    const _this = this;
    this.setState({ acountNo: e.target.value }, () => {
      _this.vaildParames(); // 验证
    });
  }

  /**
   * 银行账户change
   */
  bankInputBlur() {
    this.bankCardBinCheck();
  }

  /**
   * 卡bin接口
   */
  bankCardBinCheck() {
    const _this = this;
    if (_this.state.acountNo !== '') {
      const value = _this.state.acountNo.replace(/\s+/g,"")
      const option = {
        url: api.apiUrl.bankCardBinCheck + '?cardNo=' + value,
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.get(option).then((data) => {
        console.log(data);
        if (!data.data.cardNoFlag) { // 检验不通过
          this.setState({
            acountNo: '',
          }, () => {
            _this.vaildParames(); // 验证
          });
          window.app.alert(data.message);
        }
      }).catch((error) => {
        window.app.alert(error.message);
      });
    }
  }

  /**
   * cp刷卡收单
   */
  cpCheckedClick() {
    const cpChecked = this.state.cpChecked;
    const qrChecked = this.state.qrChecked;
    const $btnWrapper = window.$$('#btnWrapper');
    if (cpChecked === '1') {
      this.setState({ cpChecked: '0' });
      $btnWrapper.css('position', 'static');
    } else {
      this.setState({ cpChecked: '1' });
      $btnWrapper.css('position', 'static');
    }
  }

  /**
   *  银行省市的选择
   */
  binkCitySelected(e) {
    const _this = this;
    new Picker({
      'title': '请选择地区',//标题(可选)
      'defaultValue': e.target.value,//默认值-多个以空格分开（可选）
      'type': 2,//需要联动级数[1、2、3]（可选）
      'data': _this.state.provinceCityList,//数据(必传)
      'keys': {
          'id': 'Code',
          'value': 'Name',
          'childData': 'level'//最多3级联动
      },//数组内的键名称(必传，id、text、data)
      'callBack': function (val,code) {
        const province = val.split(' ')[0]; // 注册省份
        const city = val.split(' ')[1]; // 注册城市
        _this.setState({
          province: province,
          city: city,
        }, () => {
          _this.setState({ bankBranch: '' });
          _this.bankBranchList(); // 获取支行数据
        });  
      }
    });
  }

  /**
   * 获取支行列表
   */
  bankBranchList() {
    const _this = this;
    const option = {
      url: api.apiUrl.subBankInfoList + '?bankName=' + _this.state.bankName + '&city=' + _this.state.city + '&province=' + _this.state.province,
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token
      }
    };
    fetch.get(option).then((data) => {
      if (data.data.branchInfoList) {
        _this.setState({
          bankBranchList: data.data.branchInfoList,
          bankBranchAllList: data.data.branchInfoList,
        });
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 银行支行
   */
  bankBranchChange(e) {
    const _this = this;
    const bankBranchShow = _this.state.bankBranchShow;
    _this.setState({
      bankBranchShow: '1',
      bankBranch: e.target.value,
    }, () => {
      _this.bankBranchFilter();
      _this.vaildParames(); //验证
    });
  }

  /**
   * 删选银行支行
   */
  bankBranchFilter() {
    const bankBranchList = this.state.bankBranchAllList;
    const str = this.state.bankBranch;
    const list = [];
    for(let i = 0;i < bankBranchList.length; i++) {
      if(bankBranchList[i].fullBranchName.indexOf(str) !== -1) {
        list.push(bankBranchList[i]);
      }
    };
    this.setState({ bankBranchList: list });
  }

  /**
   * 支行选择
   */
  bankBranchSelected(e){
    const _this = this;
    const bankBranchName = $$(e.target).closest('li').attr('data-item');
    _this.setState({
      bankBranch: bankBranchName,
      bankBranchShow: '0',
    }, () => {
      _this.vaildParames(); //验证
    });
  }

  /**
   * Cp产品 封顶
   */
  cpCuDebitMaxFeeChange(e) {
    const value = e.target.value;
    this.setState({ cpCuDebitMaxFee: value });
  }

  /**
   * Cp产品 贷记卡
   */
  cpCuRateCreditChange(e) {
    const _this = this;
    this.setState({ cpCuRateCredit: e.target.value}, () => {
          _this.vaildParames(); //验证
        });
  }

  /**
   * Cp产品 借记卡
   */
  cpCuRateDebitChange(e) {
    const _this = this;
    this.setState({ cpCuRateDebit: e.target.value}, () => {
      _this.vaildParames(); //验证
    });
  }

  /**
   * Cp产品 单笔限额
   */
  cpMaxTxnAmtChange(e) {
    const _this = this;
    this.setState({ cpMaxTxnAmt: e.target.value }, () => {
      _this.vaildParames(); //验证
    });
  }

  /**
   * Cp产品 单日限额
   */
  cpSalesDailyQuotaChange(e) {
    const _this = this;
    this.setState({ cpSalesDailyQuota: e.target.value }, () => {
      _this.vaildParames(); //验证
    });
  }

  /**
   * 扫码 支付宝 
   */
  qrAliPayChange(e) {
    const _this = this;
    this.setState({
      qrAliPay: e.target.value
    }, () => {
      if (_this.state.qrWeChat === '' && _this.state.qrAliPay === '' && _this.state.qrCuDebitMaxFee === '' && _this.state.qrCuRateCredit === '' && _this.state.qrCuRateCredit === '') {
        window.app.alert('扫码收单，微信，支付宝，银联二维码必填一个');
      }
      _this.vaildParames(); // 验证
    });
  }

  /**
   * 扫码 封顶
   */
  qrCuDebitMaxFeeChange(e) {
    const _this = this;
    this.setState({
      qrCuDebitMaxFee: e.target.value
    }, () => {
      if (_this.state.qrWeChat === '' && _this.state.qrAliPay === '' && _this.state.qrCuDebitMaxFee === '' && _this.state.qrCuRateCredit === '' && _this.state.qrCuRateCredit === '') {
        window.app.alert('扫码收单，微信，支付宝，银联二维码必填一个');
      }
      _this.vaildParames(); // 验证
    });
  }

  /**
   * 扫码 贷记卡
   */
  qrCuRateCreditChange(e) {
    const _this = this;
    this.setState({
      qrCuRateCredit: e.target.value
    }, () => {
      if (_this.state.qrWeChat === '' && _this.state.qrAliPay === '' && _this.state.qrCuDebitMaxFee === '' && _this.state.qrCuRateCredit === '' && _this.state.qrCuRateCredit === '') {
        window.app.alert('扫码收单，微信，支付宝，银联二维码必填一个');
      }
      _this.vaildParames(); // 验证
    });
  }

  /**
   * 扫码 借记卡
   */
  qrCuRateDebitChange(e) {
    const _this = this;
    this.setState({
      qrCuRateDebit: e.target.value
    }, () => {
      if (_this.state.qrWeChat === '' && _this.state.qrAliPay === '' && _this.state.qrCuDebitMaxFee === '' && _this.state.qrCuRateCredit === '' && _this.state.qrCuRateCredit === '') {
        window.app.alert('扫码收单，微信，支付宝，银联二维码必填一个');
      }
      _this.vaildParames(); // 验证
    });
  }

  /**
   * 扫码 银二小额优惠
   */
  qrUnionPayDiscountsChange(e) {
    const _this = this;
    _this.setState({
      qrUnionPayDiscounts: e.target.value
    });
  }

  /**
   * 扫码 微信
   */
  qrWeChatChange(e) {
    const _this = this;
    this.setState({
      qrWeChat: e.target.value
    }, () => {
      if (_this.state.qrWeChat === '' && _this.state.qrAliPay === '' && _this.state.qrCuDebitMaxFee === '' && _this.state.qrCuRateCredit === '' && _this.state.qrCuRateCredit === '') {
        window.app.alert('扫码收单，微信，支付宝，银联二维码必填一个');
      }
      _this.vaildParames(); // 验证
    });
  }
  
  /**
   * 小额免签勾选
   */
  selecteCpIchalfPenny(e) {
    const cpIchalfPenny = this.state.cpIchalfPenny;
    if (cpIchalfPenny === '0') {
      this.setState({ cpIchalfPenny: '1' });
    }else {
      this.setState({ cpIchalfPenny: '0' });
    } 
  }

  /**
   * 验证参数
   */
  vaildParames() {
    const params = this.state;
    const _this = this;
    if (params.accountName === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.acountNo === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.bankName === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.province === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.bankBranch === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.cpCuRateCredit === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.cpCuRateDebit === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.cpMaxTxnAmt === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.cpSalesDailyQuota === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.bankBranch === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    if (params.qrWeChat === '' && params.qrAliPay === '' && params.qrCuDebitMaxFee === '' && params.qrCuRateCredit === '' && params.qrCuRateCredit === '') {
      _this.setState({ isNext: '0' }); // 不可以保存
      return;
    }
    _this.setState({ isNext: '1' }); // 可以保存
  }

  /**
   * 银行输入取消
   */
  cancleInput() {
    this.setState({ bankBranch: '' });
  }
  /**
   * 保存数据
   */
  saveBtn() {
    debugger //eslint-disable-line
    const _this = this;
    if(_this.state.isNext === '1') {
      const paremes = {
        idContent: _this.state.idContent,
        accountName: _this.state.accountName, // 结算户名  string  
        accountNo: _this.state.acountNo, // 银行账号  string  
        applyId: _this.state.applyId, // string  
        bankBranch: _this.state.bankBranch, // 支行  string  
        bankName: _this.state.bankName, // 银行名称  string  
        bankType: _this.state.bankType, // 对公对私  string  1 对私 0 对公
        city: _this.state.city, // 城市  string  
        cpProductRate: { // Cp产品  object
          checked: _this.state.cpChecked, // 是否选中  string  1 是 0 否
          cuDebitMaxFee: _this.state.cpCuDebitMaxFee, // 封顶  string  
          cuRateCredit: _this.state.cpCuRateCredit, // 贷记卡 string  
          cuRateDebit: _this.state.cpCuRateDebit, // 借记卡 string  
          ichalfPenny: _this.state.cpIchalfPenny, // 小额免密免签  string  1 是 0 否
          maxTxnAmt: _this.state.cpMaxTxnAmt, // 单笔限额  string  
          salesDailyQuota: _this.state.cpSalesDailyQuota, // 单日限额  string  
        },
        province: _this.state.province, // 省份  string  
        qrCodeProductRate: { // 扫码  object 
          aliPay: _this.state.qrAliPay, // 支付宝 string  
          checked: _this.state.qrChecked, // 是否选中  string  1 是 0 否
          cuDebitMaxFee: _this.state.qrCuDebitMaxFee, // 封顶  string  
          cuRateCredit: _this.state.qrCuRateCredit, // 贷记卡 string  
          cuRateDebit: _this.state.qrCuRateDebit, // 借记卡 string 
          unionPayDiscounts: _this.state.qrUnionPayDiscounts, // 银二小额优惠  string  
          weChat: _this.state.qrWeChat, // 微信  string 
        },
        userId: _this.state.userId,
      }
      if(paremes.qrCodeProductRate.qrAliPay === '' && paremes.qrCodeProductRate.qrCuDebitMaxFee === '' && paremes.qrCodeProductRate.qrCuRateCredit === '' && paremes.qrCodeProductRate.qrCuRateDebit === '' &&paremes.qrCodeProductRate.qrWeChat === '') {
        return;
      }
      // 产品费率页面信息保存埋点
      const param = {
        eventId: 'H5_agentSign_productRateInfSave',
        args: paremes,
      };
      _h5t.track('trackevent', paremes);
      // 保存数据
      const option = {
        url: api.apiUrl.productRateSave,
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
    }else {
      window.app.alert('请填写完整信息！');
    }
  };

  /**
   * 下一步
   */
  nextBtn() {
    const _this = this;
    if(_this.state.isNext === '1') {
      const paremes = {
        accountName: _this.state.accountName, // 结算户名  string  
        accountNo: _this.state.acountNo, // 银行账号  string  
        applyId: _this.state.applyId, // string  
        bankBranch: _this.state.bankBranch, // 支行  string  
        bankName: _this.state.bankName, // 银行名称  string  
        bankType: _this.state.bankType, // 对公对私  string  1 对私 0 对公
        city: _this.state.city, // 城市  string  
        cpProductRate: { // Cp产品  object
          checked: _this.state.cpChecked, // 是否选中  string  1 是 0 否
          cuDebitMaxFee: _this.state.cpCuDebitMaxFee, // 封顶  string  
          cuRateCredit: _this.state.cpCuRateCredit, // 贷记卡 string  
          cuRateDebit: _this.state.cpCuRateDebit, // 借记卡 string  
          ichalfPenny: _this.state.cpIchalfPenny, // 小额免密免签  string  1 是 0 否
          maxTxnAmt: _this.state.cpMaxTxnAmt, // 单笔限额  string  
          salesDailyQuota: _this.state.cpSalesDailyQuota, // 单日限额  string  
        },
        province: _this.state.province, // 省份  string  
        qrCodeProductRate: { // 扫码  object 
          aliPay: _this.state.qrAliPay, // 支付宝 string  
          checked: _this.state.qrChecked, // 是否选中  string  1 是 0 否
          cuDebitMaxFee: _this.state.qrCuDebitMaxFee, // 封顶  string  
          cuRateCredit: _this.state.qrCuRateCredit, // 贷记卡 string  
          cuRateDebit: _this.state.qrCuRateDebit, // 借记卡 string 
          unionPayDiscounts: _this.state.qrUnionPayDiscounts, // 银二小额优惠  string  
          weChat: _this.state.qrWeChat, // 微信  string 
        },
        userId: _this.state.userId,
      }

      // 产品费率页面信息下一步埋点
      const param = {
        eventId: 'H5_agentSign_productRateInfNext',
        args: paremes,
      };
      _h5t.track('trackevent', paremes);
      // 保存数据
      const option = {
        url: api.apiUrl.productRateSave,
        data: paremes,
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.post(option).then((data) => {
        window.app.mainView.router.load({
          url: 'p/store-terminal.html',
          animatePages: true,
          query: {
            id: _this.state.applyId
          }
        });
      }).catch((error) => {
        window.app.alert(error.message);
      });
    }else {
      window.app.alert('请填写完整信息！');
    }
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

  render() {
    const _this = this;
    const city = this.state.province + this.state.city;
    let list = <div></div>;
    list = _this.state.bankBranchList.map((item, index) => {
      if (_this.state.bankBranch !=='') {
        return (
          <li className="ell" data-item={item.fullBranchName} onClick={this.bankBranchSelected}>
            <span>{item.fullBranchName.split(_this.state.bankBranch)[0]}</span>
            <span style={{ color: '#f54d4f' }}>{_this.state.bankBranch}</span>
            <span>{item.fullBranchName.split(_this.state.bankBranch)[1]}</span>
          </li>
        )
      } else {
        return (
          <li className="ell" data-item={item.fullBranchName} onClick={this.bankBranchSelected}>
            <span>{item.fullBranchName}</span>
          </li>
        )
      }
    });
    return (
      <div className={s.wrapper}>
        <ul className={s.credentialsMessage}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 结算户名</span>
            <input className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请选择结算户名" value={this.state.accountName} onClick={this.accountNameClick}/>
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 结算账户</span>
            <input className="fr" type="text" placeholder="银行卡或对公账户" value={this.state.acountNo} onChange={this.acountNoChange} onBlur={this.bankInputBlur} />
            <i className={s.cameraOption}>&nbsp;</i>
            <input id="upload" className={s.uploadInput} name="upload" type="file" accept="image/*" onChange={this.accountInputChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 开户银行</span>
            <input className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请选择开户银行" value={this.state.bankName} onClick={this.selecteBank}/>
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 开户行省市</span>
            <input className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请选择开户银行所在省市" value={city} onClick={this.binkCitySelected}/>
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 开户支行</span>
            <input className="fr" type="text" value={this.state.bankBranch} onChange={this.bankBranchChange} />
            <i className={s.cancleInput} onClick={this.cancleInput}></i>
          </li>
          <ul className={this.state.bankBranchShow === '1' ? `${s.bankBranchWrapper}` : `${s.bankBranchWrapper} hide`}>
              {
                list
              }
          </ul>
        </ul>
        <ul className={s.credentialsMessage} style={{ marginTop: '20px' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">CP刷卡收单</span>
            <span className={this.state.cpChecked === '1' ? `fr ${s.swicthBox} ${s.open1}` : `fr ${s.swicthBox} ${s.close1}`} onClick={this.cpCheckedClick}>
              <span className={this.state.cpChecked === '1' ? `${s.swicthItem} ${s.open2}` : `${s.swicthItem} ${s.close2}`}>&nbsp;</span>
            </span>
          </li>
          <ul className={this.state.cpChecked === '1' ? `clearfix ${s.rateWrpper}` : `hide clearfix ${s.rateWrpper}`}>
            <li className={`${s.rateItem} fl`}>
              <span>* 借记卡</span>
              <input className={s.feeInput} type="text" value={this.state.cpCuRateDebit} onChange={this.cpCuRateDebitChange} onBlur={this.inputBlur} />
              <i>%</i>
            </li>
            <li className={`${s.rateItem} fl`}>
              <span>封顶</span>
              <input className={s.feeInput} type="number" value={this.state.cpCuDebitMaxFee} onChange={this.cpCuDebitMaxFeeChange} onBlur={this.inputBlur} />
              <i>元</i>
            </li>
            <li className={`${s.rateItem} fl`} style={{ marginRight: '0' }}>
              <span>* 贷记卡</span>
              <input className={s.feeInput} type="text" value={this.state.cpCuRateCredit} onChange={this.cpCuRateCreditChange} onBlur={this.inputBlur} />
              <i>%</i>
            </li>
            <li className={`${s.rateItem} ${s.feeItem} fl`}>
              <span>* 单笔限额</span>
              <input className={s.feeInput} type="text" value={this.state.cpMaxTxnAmt} onChange={this.cpMaxTxnAmtChange} onBlur={this.inputBlur} />
              <i>元</i>
            </li>
            <li className={`${s.rateItem} ${s.feeItem} fl`} style={{ marginRight: '0' }}>
              <span>* 单日限额</span>
              <input className={s.feeInput} type="text" value={this.state.cpSalesDailyQuota} onChange={this.cpSalesDailyQuotaChange} onBlur={this.inputBlur} />
              <i>元</i>
            </li>
            <li className={s.checkLi}>
              <i className={this.state.cpIchalfPenny === '1' ? `${s.selectedI} ${s.checkItem}` : `${s.checkItem}`} onClick={this.selecteCpIchalfPenny}>&nbsp;</i>
              <span>IC卡小额免密免签</span>
              <i className={s.descriptionMark} data-type="xemqMark" onClick={this.posDesMark}>&nbsp;</i>
            </li>
          </ul>
        </ul>
        <ul className={s.credentialsMessage} style={{ margin: '20px 0 30px 0' }}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">扫码收单</span>
            <span className={this.state.qrChecked === '1' ? `fr ${s.swicthBox} ${s.open1}` : `fr ${s.swicthBox} ${s.close1}`} >
              <span className={this.state.qrChecked === '1' ? `${s.swicthItem} ${s.open2}` : `${s.swicthItem} ${s.close2}`}>&nbsp;</span>
            </span>
          </li>
          <ul className={this.state.qrChecked === '1' ? `clearfix ${s.rateWrpper}` : `hide clearfix ${s.rateWrpper}`}>
            <li className={`${s.rateItem} fl`}>
              <span>微信</span>
              <input className={s.feeInput} type="text" value={this.state.qrWeChat} onChange={this.qrWeChatChange} onBlur={this.inputBlur} />
              <i>%</i>
            </li>
            <li className={`${s.rateItem} fl`}>
              <span>支付宝</span>
              <input className={s.feeInput} type="text" value={this.state.qrAliPay} onChange={this.qrAliPayChange} />
              <i>%</i>
            </li>
            <p className={`fl ${s.title}`}>银联二维码</p>
            <li className={`${s.rateItem} fl`}>
              <span>借记卡</span>
              <input className={s.feeInput} type="text" value={this.state.qrCuRateDebit} onChange={this.qrCuRateDebitChange} onBlur={this.inputBlur} />
              <i>%</i>
            </li>
            <li className={`${s.rateItem} fl`}>
              <span>封顶</span>
              <input className={s.feeInput} type="text" value={this.state.qrCuDebitMaxFee} onChange={this.qrCuDebitMaxFeeChange} onBlur={this.inputBlur} />
              <i>元</i>
            </li>
            <li className={`${s.rateItem} fl`} style={{ marginRight: '0' }}>
              <span>贷记卡</span>
              <input className={s.feeInput} type="text" value={this.state.qrCuRateCredit} onChange={this.qrCuRateCreditChange} onBlur={this.inputBlur} />
              <i>%</i>
            </li>
            <li className={`${s.rateItem} fl`} style={{ width: '100%', marginBottom: '0' }}>
              <span>银二小额优惠费率
                <i className={s.descriptionMark} data-type="yxeeMark" onClick={this.posDesMark}>&nbsp;</i>
              </span>
              <input className={s.feeInput} type="text" value={this.state.qrUnionPayDiscounts} onChange={this.qrUnionPayDiscountsChange} onBlur={this.inputBlur} />
              <i>%</i>
            </li>
            <p className={`fl ${s.tip}`}>日常消费行业,单笔交易≤1000元</p>
          </ul>
        </ul>
        <div id="btnWrapper" className={s.btnWrapper}>
          <button onClick={this.saveBtn}>保存草稿</button>
          <button className={this.state.isNext === '1' ? `${s.save} ${s.btnNext}` : `${s.btnNext}`} onClick={this.nextBtn}>下一步</button>
        </div>
        <div id="masking" className="masking" style={{ display: 'none' }}>
          <div id="contentWrapper" className="contentWrapper">
            
          </div>
          <div className="closewrapper" onClick={this.maskCancle}>
            <i></i>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductRateInf;
