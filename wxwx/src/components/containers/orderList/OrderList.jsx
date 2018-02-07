import React from 'react';
import s from './OrderList.less';
import Screen from './Screen.jsx';
import StateType from './StateType.jsx';
import Time from './Time.jsx';
import fetch from '../../../backend/fetch.js';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';
import _h5t from '../../../utils/h5t.js';

// let loading = false;
class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarClick: 0, // 页面状态
      orderList: [], // 订单列表
      showHistory: true, // 查询页面是否显示搜索历史
      showSearch: [], // 显示出来的搜索结果
      merchant: [], // 搜索列表中的商户名称
      account: [], // 搜索列表中的账户名称
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      total: 0, // 总条数
      selectMerchant: '', // 搜索中选中的商户名称
      selectAccount: '', // 搜索中选中的账户名称
      selectState: '', // 选中的状态
      selectType: '', // 选中的类型
      startDate: '', // 开始时间
      endDate: '', // 结束时间
      selectDate: false,
      historyMerchant: [], // localstorage中获取的历史商户名称
      historyAccount: [], // localstorage中获取的历史账户名称
      memberCode: '77777', // 快钱会员号
      token: null,
      loading: false, // 上拉加载状态
      hiddenScroll: false,
      userId: null,
      idContent: null,
      historyMerchantName: null,
      historyAccountName: null,
    };
  }

  componentWillMount() {
    // session中获取数据
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const memberCode = JSON.parse(sessionStorage.getItem('memberCode'));
    const token = dataList.token;
    const userId = JSON.parse(sessionStorage.getItem('userid'));
    const idContent = JSON.parse(sessionStorage.getItem('userInfo')).idContent || '';
    this.setState({
      memberCode,
      token,
      userId,
      idContent,
    });
    const PageInit = window.app.onPageInit('p/orderList.html', (page) => {
      this.setState({
        selectState: page.query.state || '',
      }, () => {
        this.orderList();
        PageInit.remove();
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
      // 请求orderList接口
      this.setState({
        currentPage: 1,
      });
      this.orderList(() => window.app.pullToRefreshDone(), true, 1);
    });
    window.$$('.infinite-scroll').on('infinite', () => {
      if (this.state.orderList.length >= this.state.total || this.state.loading) return;
      this.setState({
        loading: true,
      });
      let orderType = null;
      switch (this.state.selectType) {
        case '新增':
          orderType = 'add';
          break;
        case '变更':
          orderType = 'update';
          break;
        case '撤销':
          orderType = 'delete';
          break;
        default:
          break;
      }
      let status = '';
      switch (this.state.selectState) {
        case '草稿':
          status = '101';
          break;
        case '审批中':
          status = '115';
          break;
        case '驳回':
          status = '112';
          break;
        case '已完成':
          status = '111';
          break;
        default:
          break;
      }
      let opts = {
        idContent_merchant: this.state.selectAccount,
        currentPage: this.state.currentPage + 1,
        merchantName: this.state.selectMerchant,
        pageSize: this.state.pageSize,
        status,
      };
      if (orderType !== null) {
        opts.orderType = orderType;
      }
      if (this.state.selectDate) {
        opts.startDate = this.state.startDate;
        opts.endDate = this.state.endDate;
      }
      opts = utils.formatParams(opts);
      const conf = {
        // url: 'http://192.168.127.149:8091/app-mbp-website-gw/coe-moss-querysrv/mobile/queryOrderList',
        url: `${baseUrl2}/mobile/queryOrderList?${opts}`,
        headers: {
          authorization: this.state.token,
        },
      };
      // if (this.state.selectDate) {
      //   conf.startDate = this.state.startDate;
      //   conf.endDate = this.state.endDate;
      // }
      fetch.get(conf).then((data) => {
        const orderList = [...this.state.orderList, ...data.data];
        this.setState({
          orderList,
          loading: false,
          currentPage: this.state.currentPage + 1,
          total: data.total || 0,
        }, () => {
          if (this.state.orderList.length >= this.state.total) {
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
  orderList(callback, loader = false, currentPage) {
    window.$$('.infinite-scroll')[0].scrollTop = 0;
    const params = {
      eventId: 'H5_agentSign_orderList',
      args: {
        state: this.state.selectState,
        type: this.state.selectType,
      },
    };
    _h5t.track('trackevent', params);
    let orderType = null;
    switch (this.state.selectType) {
      case '新增':
        orderType = 'add';
        break;
      case '变更':
        orderType = 'update';
        break;
      case '撤销':
        orderType = 'delete';
        break;
      default:
        break;
    }
    let status = '';
    switch (this.state.selectState) {
      case '草稿':
        status = '101';
        break;
      case '审批中':
        status = '115';
        break;
      case '驳回':
        status = '112';
        break;
      case '已完成':
        status = '111';
        break;
      default:
        break;
    }
    let opts = {
      idContent_merchant: this.state.selectAccount,
      currentPage: currentPage || this.state.currentPage,
      merchantName: this.state.selectMerchant,
      pageSize: this.state.pageSize,
      status,
    };
    if (orderType !== null) {
      opts.orderType = orderType;
    }
    if (this.state.selectDate) {
      opts.startDate = this.state.startDate;
      opts.endDate = this.state.endDate;
    }
    opts = utils.formatParams(opts);
    const conf = {
      // url: 'http://localhost:8888/orderList',
      url: `${baseUrl2}/mobile/queryOrderList?${opts}`,
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
        orderList: data.data,
        loading: true,
        total: data.total || 0,
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
    if ((num === 1 || num === 2 || num === 4) && this.state.selectState === '草稿') return;
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

  // timeBack() {
  //   this.setState({
  //     navbarClick: 0,
  //     startDate: '', // 开始时间
  //     endDate: '', // 结束时间
  //     selectDate: false,
  //     currentPage: 1,
  //   }, () => this.orderList());
  // }

  clickOrder(value) {
    const params = {
      eventId: 'H5_agentSign_P_order',
    };
    _h5t.track('pageview', params);
    console.log(this.state.navbarClick);
    window.app.mainView.router.load({
      url: 'p/order.html',
      animatePages: true,
      query: {
        orderId: value.orderId,
      },
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

  goEnterprise(val) {
    const params = {
      eventId: 'H5_agentSign_P_enterprise',
      args: {
        bianji: true,
      },
    };
    _h5t.track('pageview', params);
    console.log(this.state.navbarClick);
    sessionStorage.setItem('option', 'edit');
    window.app.mainView.router.load({
      url: 'p/enterprise-index.html',
      animatePages: true,
      query: {
        id: val.orderId,
        type: 'edit',
        status: val.status,
      },
    });
  }

  renderOrderList(value) {
    console.log(this.state.navbarClick);
    let status = '';
    switch (value.status) {
      case '101':
        status = '草稿';
        break;
      case '115':
        status = '审批中';
        break;
      case '112':
        status = '驳回';
        break;
      case '111':
        status = '已完成';
        break;
      default:
        break;
    }

    return (
      <div className={`content-block-inner ${s.contentInner}`}>
        <div className={`${s.title}`} onClick={status === '草稿' ? null : () => this.clickMerchant(value)}>{value.merchantName}</div>
        <div className={`${s.center}`}>
          <div className={`${s.list} row no-gutter`} onClick={() => this.clickOrder(value)}>
            <div className={`${s.left} col-40`}>订单编号</div>
            <div className={`${s.right} col-60`}>{value.orderId}</div>
          </div>
          <div className={`${s.list} row no-gutter`}>
            <div className={`${s.left} col-40`}>创建时间</div>
            <div className={`${s.right} col-60`}>{value.applyDate}</div>
          </div>
          {status === '草稿' ? null : <div className={`${s.list} row no-gutter`}>
            <div className={`${s.left} col-40`}>处理时间</div>
            <div className={`${s.right} col-60`}>{value.dealTime}</div>
          </div>}
          <div className={`${s.list} row no-gutter`}>
            <div className={`${s.left} col-40`}>订单状态</div>
            <div className={`${s.right} col-60`}>{status}</div>
          </div>
          {status === '草稿' ? null : <div className={`${s.list} row no-gutter`}>
            <div className={`${s.left} col-40`}>审批日志</div>
            <div className={`${s.right} col-60`}>{value.advice}</div>
          </div>}
        </div>
        <div className={`${s.bottom} ${value.status === '101' || value.status === '112' ? null : s.hidden}`}><p><a href="#" className="button" onClick={() => this.goEnterprise(value)}>编辑</a></p></div>
      </div>
    );
  }

  render() {
    return (
      <div className="page" data-page="orderList">
        <div className="page-content">
          <div className={`${s.navbar} row no-gutter`}>
            <div
              className={`col-20 ${s.navbarCol} ${this.state.navbarClick === 1 ? s.click : null} ${this.state.selectMerchant !== '' ? s.showtext : null} ${this.state.selectState === '草稿' ? s.gray : null}`}
              onClick={() => this.navbarClick(1)}
            >
              {this.state.selectMerchant === '' ? '商户' : this.state.selectMerchant}
            </div>
            <div
              className={`col-20 ${s.navbarCol} ${this.state.navbarClick === 2 ? s.click : null} ${this.state.selectAccount !== '' ? s.showtext : null} ${this.state.selectState === '草稿' ? s.gray : null}`}
              onClick={() => this.navbarClick(2)}
            >
              {this.state.selectAccount === '' ? '账户' : this.state.selectAccount}
            </div>
            <div
              className={`col-20 ${s.navbarCol} ${this.state.navbarClick === 3 ? s.click : null} ${this.state.selectState !== '' ? s.showtext : null}`}
              onClick={() => this.navbarClick(3)}
            >
              {this.state.selectState === '' ? '状态' : this.state.selectState}
              <div className={`${this.state.navbarClick === 3 ? s.mark2 : s.mark} ${this.state.selectState !== '' ? s.hidden : null}`} />
            </div>
            <div
              className={`col-20 ${s.navbarCol} ${this.state.navbarClick === 4 ? s.click : null} ${this.state.selectType !== '' ? s.showtext : null} ${this.state.selectState === '草稿' ? s.gray : null}`}
              onClick={() => this.navbarClick(4)}
            >
              {this.state.selectType === '' ? '类型' : this.state.selectType}
              <div className={`${this.state.navbarClick === 4 ? s.mark2 : s.mark} ${this.state.selectType !== '' ? s.hidden : null} ${this.state.selectState === '草稿' ? s.gray : null}`} />
            </div>
            <div className={`col-20 ${s.navbarCol2}`} onClick={() => this.navbarClick(5)}>
              <div className={`${s.screen} ${this.state.selectDate ? s.showtext : null}`}>
                筛选
              </div>
            </div>
          </div>
          { this.state.navbarClick === 0 ?
            null :
            <div
              className={`${s.prop} ${this.state.navbarClick === 5 ? s.prop2 : null}`}
              onClick={() => this.navbarClick(0)}
            /> }
          { this.state.navbarClick === 1 || this.state.navbarClick === 2 ?
            <Screen this={this} /> : null }
          {this.state.navbarClick === 3 || this.state.navbarClick === 4 ?
            <StateType this={this} /> : null }
          { this.state.navbarClick === 5 ?
            <Time this={this} /> : null }
          <div className={`${s.contentList} pull-to-refresh-content infinite-scroll`} data-ptr-distance="70" data-distance="100">
            <div className="pull-to-refresh-layer">
              <div className="preloader" />
              <div className="pull-to-refresh-arrow" />
            </div>
            <div className={`content-block ${s.contentBlock}`}>
              {/* <div className={`content-block-inner ${s.contentInner}`}>
                <div className={`${s.title}`} onClick={() => this.clickMerchant(1)}>{1}</div>
                <div className={`${s.center}`}>
                  <div className={`${s.list} row no-gutter`} onClick={() => this.clickOrder(1)}>
                    <div className={`${s.left} col-40`}>订单编号</div>
                    <div className={`${s.right} col-60`}>{1}</div>
                  </div>
                  <div className={`${s.list} row no-gutter`}>
                    <div className={`${s.left} col-40`}>创建时间</div>
                    <div className={`${s.right} col-60`}>{1}</div>
                  </div>
                  <div className={`${s.list} row no-gutter`}>
                    <div className={`${s.left} col-40`}>处理时间</div>
                    <div className={`${s.right} col-60`}>{1}</div>
                  </div>
                  <div className={`${s.list} row no-gutter`}>
                    <div className={`${s.left} col-40`}>订单状态</div>
                    <div className={`${s.right} col-60`}>{1}</div>
                  </div>
                  <div className={`${s.list} row no-gutter`}>
                    <div className={`${s.left} col-40`}>审批日志</div>
                    <div className={`${s.right} col-60`}>{1}</div>
                  </div>
                </div>
              </div> */}
              {this.state.orderList.map((value, index) => this.renderOrderList(value, index))}
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

export default OrderList;
