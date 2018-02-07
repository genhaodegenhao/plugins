import React from 'react';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import s from './credit-inf.less';
import _h5t from '../../../utils/h5t.js';

class CreditInf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swicth: '0',
      applyId: '', // 应用id
      idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
      validDateStr: '', // 开始时间 string
      expireDateStr: '', // 结束时间  string  
      businessScope: '', // 经营范围  string  
      registProvince: '', // 注册省份  string
      registCity: '', // 注册城市  string
      registAddress: '', // 注册地址  string 
      companyType: '', // 企业类型  string  非公司企业法人 个体工商户 私营独资企业 私营合伙企业 有限责任公司 股份有限责任公司 非企业类型商户
      industryCode: '', //  行业代码  string   
      registCapital: '', //  注册资本  string
      userId: sessionStorage.getItem('userid'), // 操作员Id string
      provinceCityList: [], // 省市列表
      companyTypeList: [{
        text: '非公司企业法人',
      }, {
        text: '个体工商户',
      }, {
        text: '私营独资企业',
      }, {
        text: '私营合伙企业',
      }, {
        text: '有限责任公司',
      }, {
        text: '股份有限责任公司',
      }], // 企业类型列表
      isNext: '0', // 是否可以保存
    };
    this.getData = this.getData.bind(this);
    this.swicthClick = this.swicthClick.bind(this);
    this.businessScopeChange = this.businessScopeChange.bind(this);
    this.registAddressChange = this.registAddressChange.bind(this);
    this.industryCodeChange = this.industryCodeChange.bind(this);
    this.registCapitalChange = this.registCapitalChange.bind(this);
    this.selecteCity = this.selecteCity.bind(this);
    this.companyTypeSelect = this.companyTypeSelect.bind(this);
    this.vaildParames = this.vaildParames.bind(this);
    this.saveBtn = this.saveBtn.bind(this);
    this.nextBtn = this.nextBtn.bind(this);

    this.enterpriseCredit = this.enterpriseCredit.bind(this);
  }

  componentDidMount() {
    console.log(fetch);
    const _this = this;

    const pages = window.app.onPageInit('p/credit-inf.html', (page) => {
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
      'trigger': '#startDate', // 标签id
      'type': 'date', // date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'isDefault': true, //默认值为 9999-12-31
      'maxDate': _this.state.expireDateStr, // 最大日期
      onChange:function(e) {
        _this.setState({ 
          validDateStr: e.target.value 
        }, () => {
          calendarEnd.minDate(_this.state.validDateStr);
          _this.vaildParames(); //验证
        });
      }
    });

    // 结束事件初始化
    calendarEnd.init({
      'trigger': '#endDate', // 标签id
      'type': 'date', // date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
      'isDefault': true, //默认值为 9999-12-31 
      'minDate': _this.state.validDateStr, // 最小日期
      'maxDate': 9999 + '-' + 12 + '-' + 31, // 最大日期
      onChange:function(e) {
        _this.setState({ 
          expireDateStr: e.target.value 
        }, () => {
          calendar.maxDate(_this.state.expireDateStr);
          _this.vaildParames(); //验证
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
      eventId: 'H5_agentSign_P_creditInf',
    };
    _h5t.track('pageview', params);
  }


  /**
   * 获取数据
   */
  getData(id) {
    // 接口获取数据
    console.log(this);
    console.log(id);
    const _this = this;
    const option = {
      url: api.apiUrl.applyPageInfo,
      data: {
        applyId: id,
        pageType: 'mlZxbc',
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token
      }
    };
    fetch.post(option).then((data) => {
      console.log(data);
      if(data.data) {
        _this.setState({
          validDateStr: data.data.validDateStr, // 开始时间 string
          expireDateStr: data.data.expireDateStr, // 结束时间  string  
          businessScope: data.data.businessScope, // 经营范围  string  
          registProvince: data.data.registProvince, // 注册省份  string
          registCity: data.data.registCity, // 注册城市  string
          registAddress: data.data.registAddress, // 注册地址  string 
          companyType: data.data.companyType, // 企业类型  string  非公司企业法人 个体工商户 私营独资企业 私营合伙企业 有限责任公司 股份有限责任公司 非企业类型商户
          industryCode: data.data.industryCode, //  行业代码  string   
          registCapital: data.data.registCapital, //  注册资本  string
        }, () => {
          _this.vaildParames(); //验证
          if (_this.state.expireDateStr === '9999-12-31') {
            _this.setState({
              swicth: '1',
            });
          }
        });
      }else {
        _this.enterpriseCredit();
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 征信回填
   */
  enterpriseCredit() {
    const _this = this;
    const option = {
      url: api.apiUrl.enterpriseCredit,
      data: {
        applyId: _this.state.applyId,
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token
      }
    };
    fetch.post(option).then((data) => {
      console.log(data);
      if(data.data) {
        _this.setState({
          validDateStr: data.data.manageBeginDate, // 开始时间 string
          expireDateStr: data.data.manageEndDate, // 结束时间  string  
          businessScope: data.data.manageRangeFashion, // 经营范围  string  
          // registProvince: data.data.registProvince, // 注册省份  string
          // registCity: data.data.registCity, // 注册城市  string
          industryCode: data.data.tradecode, //  行业代码  string   
          registCapital: data.data.registFund, //  注册资本  string
        }, () => {
          if (_this.state.expireDateStr === '9999-12-31') {
            _this.setState({
              swicth: '1',
            });
          }
          if (/^[有限责任公司].*$/.test(data.data.corpType)) {
            _this.setState({
              companyType: '有限责任公司',
            }, () => {
              _this.vaildParames(); //验证
            })
          }
          if (/^[股份].*$/.test(data.data.corpType)) {
            _this.setState({
              companyType: '股份有限责任公司',
            }, () => {
              _this.vaildParames(); //验证
            })
          }
          if (/^.*\[合伙企业].*$/.test(data.data.corpType)) {
            _this.setState({
              companyType: '私营合伙企业',
            }, () => {
              _this.vaildParames(); //验证
            })
          }
          if (/^.*\[独资企业].*$/.test(data.data.corpType)) {
            _this.setState({
              companyType: '私营独资企业',
            }, () => {
              _this.vaildParames(); //验证
            })
          }
          if (data.data.corpType === '个体工商户') {
            _this.setState({
              companyType: '个体工商户',
            }, () => {
              _this.vaildParames(); //验证
            })
          }
          if (data.data.corpType === '') {
            _this.setState({
              companyType: '非公司企业法人',
            }, () => {
              _this.vaildParames(); //验证
            })
          }
        });
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }
   /**
   *  开关点击
   */
  swicthClick() {
    const _this = this;
    const swicth = _this.state.swicth;
    if (swicth === '1') {
      _this.setState({
        swicth: '0',
        expireDateStr: ''
       });
    } else {
      _this.setState({
        swicth: '1',
        expireDateStr: '9999-12-31'
       });
    }
  }

  /**
   * 经营范围
   */
  businessScopeChange(e) {
    const _this = this;
    this.setState({
      businessScope: e.target.value
    }, () => {
      _this.vaildParames(); //验证
    });
  }

  /**
   * 详细地址
   */
  registAddressChange(e) {
    const _this = this;
    this.setState({
      registAddress: e.target.value
    }, () => {
      _this.vaildParames(); //验证
    });
  }

  /**
   * 行业代码
   */
  industryCodeChange(e) {
    this.setState({industryCode: e.target.value});
  }

  /**
   * 注册资本
   */
  registCapitalChange(e) {
    this.setState({registCapital: e.target.value});
  }

  /* eslint-disable */
  selecteCity(e) {
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
        const registProvince = val.split(' ')[0]; // 注册省份
        const registCity = val.split(' ')[1]; // 注册城市
        _this.setState({
          registProvince: registProvince,
          registCity: registCity,
        }, () => {
          _this.vaildParames(); //验证
        });  
      }
    });
  }

  /**
   * 选择企业类型
   */
  companyTypeSelect(e) {
    const _this = this;
    new Picker({
      'title': '请选择企业类型',//标题(可选)
      'defaultValue': e.target.value,//默认值-多个以空格分开（可选）
      'type': 1,//需要联动级数[1、2、3]（可选）
      'data': _this.state.companyTypeList,//数据(必传)
      'keys': {
          'id': 'text',
          'value': 'text'
      },//数组内的键名称(必传，id、text、data)
      'callBack': function (val,code) {
        _this.setState({
          companyType: val
        }, () => {
          _this.vaildParames(); //验证
        });  
      }
    });
  }

  /**
   * 验证参数
   */
  vaildParames() {
    const prames = this.state;
    const _this = this;
    if (prames.validDateStr === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    if (prames.expireDateStr === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    if (prames.companyType === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    if (prames.businessScope === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    if (prames.registProvince === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    if (prames.registCity === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    if (prames.registAddress === '') {
      _this.setState({ isNext: '0' }); // 可以保存
      return;
    }
    _this.setState({ isNext: '1' }); // 可以保存
  }

  /**
   * 保存数据
   */
  saveBtn() {
    const _this = this;
    if(_this.state.isNext === '1') {
      const params = {
        applyId: _this.state.applyId, // 应用id
        idContent: _this.state.idContent,
        validDateStr: _this.state.validDateStr, // 开始时间 string
        expireDateStr: _this.state.expireDateStr, // 结束时间  string  
        businessScope: _this.state.businessScope, // 经营范围  string  
        registProvince: _this.state.registProvince, // 注册省份  string
        registCity: _this.state.registCity, // 注册城市  string
        registAddress: _this.state.registAddress, // 注册地址  string 
        companyType: _this.state.companyType, // 企业类型  string  非公司企业法人 个体工商户 私营独资企业 私营合伙企业 有限责任公司 股份有限责任公司 非企业类型商户
        industryCode: this.state.industryCode, //  行业代码  string   
        registCapital: this.state.registCapital, //  注册资本  string
        userId: this.state.userId, // 操作员Id string
      }
      sessionStorage.setItem('creditParames',JSON.stringify(params));

      // 征信补充页面信息保存埋点
      const param = {
        eventId: 'H5_agentSign_creditInfSave',
        args: params,
      };
      _h5t.track('trackevent', param);
      // 保存数据
      const option = {
        url: api.apiUrl.creditSupplSave,
        data: params,
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
    }else{
      window.app.alert('带*项为必填信息！');
    }
  }

  /**
   * 下一步
   */
  nextBtn() {
    const _this = this;
    if(_this.state.isNext === '1') {
      const params = {
        applyId: _this.state.applyId, // 应用id
        idContent: _this.state.idContent,
        validDateStr: _this.state.validDateStr, // 开始时间 string
        expireDateStr: _this.state.expireDateStr, // 结束时间  string  
        businessScope: _this.state.businessScope, // 经营范围  string  
        registProvince: _this.state.registProvince, // 注册省份  string
        registCity: _this.state.registCity, // 注册城市  string
        registAddress: _this.state.registAddress, // 注册地址  string 
        companyType: _this.state.companyType, // 企业类型  string  非公司企业法人 个体工商户 私营独资企业 私营合伙企业 有限责任公司 股份有限责任公司 非企业类型商户
        industryCode: this.state.industryCode, //  行业代码  string   
        registCapital: this.state.registCapital, //  注册资本  string
        userId: this.state.userId, // 操作员Id string
      }
      sessionStorage.setItem('creditParames',JSON.stringify(params));

      // 征信补充页面信息下一步埋点
      const param = {
        eventId: 'H5_agentSign_creditInfNext',
        args: params,
      };
      _h5t.track('trackevent', param);
      // 保存数据
      const option = {
        url: api.apiUrl.creditSupplSave,
        data: params,
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token
        }
      };
      fetch.post(option).then((data) => {
        window.app.mainView.router.load({
          url: 'p/product-rate-inf.html',
          animatePages: true,
          query: {
            id: _this.state.applyId
          }
        });
      }).catch((error) => {
        window.app.alert(error.message);
      });
    }else {
      window.app.alert('带*项为必填信息！');
    }
  }

  render() {
    const city = this.state.registProvince + ' ' + this.state.registCity;
    return (
      <div className={s.wrapper}>
        <ul className={s.credentialsMessage}>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 开始时间</span>
            <input id="startDate" className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请选择开始时间" value={this.state.validDateStr} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">营业执照永久有效</span>
            <span className={this.state.swicth === '1' ? `fr ${s.swicthBox} ${s.open1}` : `fr ${s.swicthBox} ${s.close1}`} onClick={this.swicthClick}>
              <span className={this.state.swicth === '1' ? `${s.swicthItem} ${s.open2}` : `${s.swicthItem} ${s.close2}`}>&nbsp;</span>
            </span>
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 结束时间</span>
            <input id="endDate" className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请输入结束时间" value={this.state.expireDateStr} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 经营范围</span>
            <input className="fr" type="text" placeholder="请输入经营范围" value={this.state.businessScope} onChange={this.businessScopeChange}/>
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 注册省市</span>
            <input className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请选择注册省市" value={city} onClick={this.selecteCity} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 详细地址</span>
            <input className="fr" type="text" placeholder="请填写注册的详细地址" value={this.state.registAddress} onChange={this.registAddressChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">* 企业类型</span>
            <input className={`fr ${s.selectOption}`} type="text" readOnly placeholder="请选择" value={this.state.companyType} onClick={this.companyTypeSelect} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">行业代码</span>
            <input className="fr" type="type" placeholder="请输入行业代码" value={this.state.industryCode} onChange={this.industryCodeChange} />
          </li>
          <li className={`clearfix ${s.credentialItem}`}>
            <span className="fl">注册资本(万元)</span>
            <input className="fr" type="text" placeholder="请输入注册资本" value={this.state.registCapital} onChange={this.registCapitalChange} />
          </li>
        </ul>
        <p className={s.tip}>带*项为必填信息</p>
        <div className={s.btnWrapper}>
          <button onClick={this.saveBtn}>保存草稿</button>
          <button className={this.state.isNext === '1' ? `${s.save} ${s.btnNext}` : `${s.btnNext}`} onClick={this.nextBtn}>下一步</button>
        </div>
      </div>
    );
  }
}

export default CreditInf;
