import React from 'react';
import s from './MerchantList.less';
import Screen from './Screen.jsx';
import StateType from './StateType.jsx';
import Time from './Time.jsx';
import fetch from '../../../backend/fetch.js';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';
import _h5t from '../../../utils/h5t.js';

class MerchantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarClick: 0, // 页面状态
      merchantList: [], // 商户列表
      showHistory: true, // 查询页面是否显示搜索历史
      showSearch: [], // 显示出来的搜索结果
      merchant: [], // 搜索列表中的商户名称
      account: [], // 搜索列表中的账户名称
      currentPage: 1, // 当前页码
      pageSize: 20, // 页面大小
      total: 0, // 总条数
      selectMerchant: '', // 搜索中选中的商户名称
      selectAccount: '', // 搜索中选中的账户名称
      // selectState: '', // 选中的状态
      selectType: '', // 选中的类型
      startDate: '', // 开始时间
      endDate: '', // 结束时间
      selectDate: false,
      historyMerchant: [], // localstorage中获取的历史商户名称
      historyAccount: [], // localstorage中获取的历史账户名称
      userId: null, // 
      idContent: '', // 邮箱
      memberCode: '', // 快钱会员号
      userType: '', // 操作员类型
      token: null,
      loading: false, // 上拉加载状态
      hiddenScroll: false,
      historyMerchantName: null,
      historyAccountName: null,
    };
  }

  componentWillMount() {
    // session中获取数据
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const userId = JSON.parse(sessionStorage.getItem('userid'));
    const idContent = JSON.parse(sessionStorage.getItem('userInfo')).idContent || '';
    const memberCode = JSON.parse(sessionStorage.getItem('memberCode'));
    const userType = dataList.memberType;
    const token = dataList.token;
    this.setState({
      idContent,
      userId,
      memberCode,
      userType,
      token,
    });
    const PageInit = window.app.onPageInit('p/merchantList.html', (page) => {
      this.setState({
        selectType: page.query.state || '',
      }, () => {
        PageInit.remove();
        this.merchantList();
      });
    });
    // 获取localstorage信息
    const historyMerchantName = `merchant${userId}${idContent}`;
    const historyAccountName = `account${userId}${idContent}`;
    const historyMerchant = JSON.parse(localStorage.getItem(historyMerchantName));
    const historyAccount = JSON.parse(localStorage.getItem(historyAccountName));
    this.setState({
      historyMerchant: historyMerchant || [],
      historyAccount: historyAccount || [],
      historyMerchantName,
      historyAccountName,
    });
    // 未完成

    // 商户名称列表
    const conf2 = {
      // url: 'http://localhost:8888/merchantName',
      url: `${baseUrl2}/mobile/queryMerchantNameList`,
      headers: {
        authorization: token,
      },
      loader: true,
    };
    // 账号名称列表
    const conf3 = {
      // url: 'http://localhost:8888/account',
      url: `${baseUrl2}/mobile/queryBillAccountList`,
      headers: {
        authorization: token,
      },
      loader: true,
    };
    fetch.get(conf2).then((data) => {
      this.setState({
        merchant: data.data,
      });
    }).catch((error) => {
      console.log(error.message, 'queryMerchantNameList');
    });
    fetch.get(conf3).then((data) => {
      this.setState({
        account: data.data,
      });
    }).catch((error) => {
      console.log(error.message, 'queryBillAccountList');
    });
  }

  componentDidMount() {
    window.$$('.pull-to-refresh-content').on('refresh', () => {
      // 请求merchantList接口
      this.setState({
        currentPage: 1,
      });
      this.merchantList(() => window.app.pullToRefreshDone(), true, 1);
    });
    window.$$('.infinite-scroll').on('infinite', () => {
      console.log('.infinite-scroll');
      if (this.state.merchantList.length >= this.state.total || this.state.loading) return;
      this.setState({
        loading: true,
      });
      let merchantType = '';
      switch (this.state.selectType) {
        case '企业':
          merchantType = 0;
          break;
        case '个人':
          merchantType = 1;
          break;
        case '个体户':
          merchantType = 2;
          break;
        default:
          break;
      }
      let opts = {
        currentPage: this.state.currentPage + 1,
        memberCode: this.state.memberCode,
        merchantName: this.state.selectMerchant,
        merchantType,
        pageSize: this.state.pageSize,
        userId: this.state.userId,
        userType: this.state.userType,
      };
      if (merchantType !== '') {
        opts.merchantType = merchantType;
      }
      if (this.state.selectDate) {
        opts.startDate = this.state.startDate;
        opts.endDate = this.state.endDate;
      }
      if (this.state.selectAccount !== '') {
        opts.billAccount = this.state.selectAccount;
      }
      opts = utils.formatParams(opts);
      const conf = {
        // url: 'http://localhost:8888/merchantList',
        // url: `${baseUrl}/mobile/queryMerchantList?userId=admin&memberCode=10209976086`,
        url: `${baseUrl2}/mobile/queryMerchantList?${opts}`,
        headers: {
          authorization: this.state.token,
        },
      };
      if (this.state.selectDate) {
        conf.startDate = this.state.startDate;
        conf.endDate = this.state.endDate;
      }
      fetch.get(conf).then((data) => {
        const merchantList = [...this.state.merchantList, ...data.data];
        this.setState({
          merchantList,
          loading: false,
          currentPage: this.state.currentPage + 1,
          total: data.total,
        }, () => {
          if (this.state.merchantList.length >= this.state.total) {
            this.setState({
              hiddenScroll: true,
            });
          }
        });
      }).catch((error) => {
        window.app.toast(error.message);
      });
    });
  }

  // 请求我的订单列表
  merchantList(callback, loader = false, currentPage) {
    window.$$('.infinite-scroll')[0].scrollTop = 0;
    const params = {
      eventId: 'H5_agentSign_merchantList',
      args: {
        type: this.state.selectType,
      },
    };
    _h5t.track('trackevent', params);
    let merchantType = null;
    switch (this.state.selectType) {
      case '企业':
        merchantType = 0;
        break;
      case '个人':
        merchantType = 1;
        break;
      case '个体户':
        merchantType = 2;
        break;
      default:
        break;
    }
    let opts = {
      currentPage: currentPage || this.state.currentPage,
      memberCode: this.state.memberCode,
      merchantName: this.state.selectMerchant,
      pageSize: this.state.pageSize,
      userId: this.state.userId,
      userType: this.state.userType,
    };
    if (this.state.selectAccount !== '') {
      opts.billAccount = this.state.selectAccount;
    }
    if (this.state.selectDate) {
      opts.startDate = this.state.startDate;
      opts.endDate = this.state.endDate;
    }
    if (merchantType !== null) {
      opts.merchantType = merchantType;
    }
    opts = utils.formatParams(opts);
    const conf = {
      // url: 'http://localhost:8888/merchantList',
      // url: `${baseUrl}/mobile/queryMerchantList?userId=admin&memberCode=10209976086`,
      url: `${baseUrl2}/mobile/queryMerchantList?${opts}`,
      headers: {
        authorization: this.state.token,
      },
    };
    // if (this.state.selectDate) {
    //   conf.startDate = this.state.startDate;
    //   conf.endDate = this.state.endDate;
    // }
    conf.loader = loader;
    fetch.get(conf).then((data) => {
      this.setState({
        merchantList: data.data,
        loading: true,
        total: data.total,
        hiddenScroll: false,
      }, () => {
        this.setState({
          loading: false,
        });
        if (callback) {
          callback();
        }
      });
    }).catch((error) => {
      window.app.toast(error.message);
      if (callback) {
        callback();
      }
    });
  }

  navbarClick(num) {
    const clickNum = this.state.navbarClick === num ? 0 : num;
    this.setState({
      navbarClick: 0,
    }, () => {
      this.setState({
        navbarClick: clickNum,
        showHistory: true,
      });
    });
  }

  timeBack() {
    this.setState({
      navbarClick: 0,
    });
  }

  clickMerchant(value) {
    const params = {
      eventId: 'H5_agentSign_P_merchant',
    };
    _h5t.track('pageview', params);
    console.log(this.state.navbarClick);
    window.app.mainView.router.load({
      url: 'p/merchant.html',
      animatePages: true,
      query: {
        billAccount: value.billAccount,
        memberCode: value.memberCode,
        merchantCode: value.merchantCode,
      },
    });
  }

  renderMerchantList(value) {
    return (
      <li className={`${s.listInner}`}>
        <a className="item-link item-content" href="#" onClick={() => this.clickMerchant(value)}>
          <div className={`item-inner ${s.innerMyIndent}`}>
            <div className={`item-title ${s.title}`}>{value.date}</div>
            <div className={`item-title ${s.title}`}>{value.merchantName}</div>
          </div>
        </a>
      </li>
    );
  }

  render() {
    return (
      <div className="page" data-page="merchantList">
        <div className="page-content">
          <div className={`${s.navbar} row no-gutter`}>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 4 ? s.click : null} ${this.state.selectType !== '' ? s.showtext : null}`}
              onClick={() => this.navbarClick(4)}
            >
              {this.state.selectType === '' ? '类型' : this.state.selectType}
              <div className={`${this.state.navbarClick === 4 ? s.mark2 : s.mark} ${this.state.selectType !== '' ? s.hidden : null}`} />
            </div>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 1 ? s.click : null} ${this.state.selectMerchant !== '' ? s.showtext : null}`}
              onClick={() => this.navbarClick(1)}
            >
              {this.state.selectMerchant === '' ? '名称' : this.state.selectMerchant}
              <div className={`${this.state.navbarClick === 1 ? s.mark2 : s.mark} ${this.state.selectMerchant !== '' ? s.hidden : null}`} />
            </div>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 2 ? s.click : null} ${this.state.selectAccount !== '' ? s.showtext : null}`}
              onClick={() => this.navbarClick(2)}
            >
              {this.state.selectAccount === '' ? '账户' : this.state.selectAccount}
              <div className={`${this.state.navbarClick === 2 ? s.mark2 : s.mark} ${this.state.selectAccount !== '' ? s.hidden : null}`} />
            </div>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 5 ? s.click : null} ${this.state.selectDate ? s.showtext : null}`}
              onClick={() => this.navbarClick(5)}
            >
              时间
              <div className={`${this.state.navbarClick === 5 ? s.mark2 : s.mark}`} />
            </div>
          </div>
          { this.state.navbarClick === 0 ?
            null :
            <div
              className={`${s.prop}`}
              onClick={() => this.timeBack()}
            /> }
          { this.state.navbarClick === 1 || this.state.navbarClick === 2 ?
            <Screen this={this} /> : null }
          {this.state.navbarClick === 3 || this.state.navbarClick === 4 ?
            <StateType this={this} /> : null }
          { this.state.navbarClick === 5 ? <Time this={this} /> : null }
          <div className={`${s.contentList} pull-to-refresh-content infinite-scroll`} data-ptr-distance="70" data-distance="100">
            <div className="pull-to-refresh-layer">
              <div className="preloader" />
              <div className="pull-to-refresh-arrow" />
            </div>
            {/* <div className={`content-block ${s.contentBlock}`}> 
                {this.state.merchantList.map((value, index)
                => this.renderMerchantList(value, index))} 
            </div> */}
            <div className={`list-block ${s.listBlock}`}>
              <ul>
                {/* <li className={`${s.listInner}`}>
                  <a
                    className="item-link item-content"
                    href="#" onClick={() => this.clickMerchant(123)}>
                    <div className={`item-inner ${s.innerMyIndent}`}>
                      <div className={`item-title ${s.title}`}>{111}</div>
                      <div className={`item-title ${s.title}`}>{222}</div>
                    </div>
                  </a>
                </li> */}
                {
                  this.state.merchantList.map(
                    (value, index) => this.renderMerchantList(value, index)
                  )
                }
              </ul>
            </div>
            <div className={`infinite-scroll-preloader ${s.scrollPreloader} ${this.state.hiddenScroll ? s.hidden : s.hidden}`}>
              <div className="preloader" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MerchantList;
