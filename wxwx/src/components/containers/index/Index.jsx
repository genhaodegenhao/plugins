import React from 'react';
import s from './Index.less';
import { baseUrl2 } from '../../../backend/mixins/api';
// import ajax from '../../../backend/server.js';
import utils from '../../../utils/utils.js';
import fetch from '../../../backend/fetch.js';
import _h5t from '../../../utils/h5t.js';

// console.log(location.protocol === 'http:', 'location.protocol');
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      merchantStatistics: [],
      noticeStatistics: 0, // 消息
      orderStatistics: [],
      operatorName: '', // 账户名称
      idContent: '', // 邮箱
      userId: '', // 
      name: '', // 代理商
      token: null, //
      hasImportant: 'N',
      hidden: false,
    };
  }

  componentWillMount() {
    // session中获取数据
    const dataList = JSON.parse(sessionStorage.getItem('dataList')) || {};
    const operatorName = dataList.operatorName;
    const idContent = JSON.parse(sessionStorage.getItem('userInfo')).idContent || '';
    const userId = JSON.parse(sessionStorage.getItem('userid'));
    const name = dataList.name;
    const token = dataList.token;
    this.setState({
      operatorName,
      idContent,
      userId,
      name,
      token,
    });
  }

  componentDidMount() {
    // TODO
    this.ajax();
    // 下拉刷新
    window.$$('.pull-to-refresh-content').on('refresh', () => {
      // 请求merchantList接口
      this.ajax(() => window.app.pullToRefreshDone());
    });
  }
  ajax(callback) {
    const opts = utils.formatParams({ idContent: this.state.idContent });
    const conf = {
      url: `${baseUrl2}/mobile/homePageStatistics?${opts}`,
      // url: 'http://192.168.127.149:8091/app-mbp-website-gw/coe-adscm-feign/coe-moss-querysrv/mobile/homePageStatistics?userId=admin&memberCode=10011811329&billAccount=test@99bill.com',
      headers: {
        authorization: this.state.token,
      },
    };
    fetch.get(conf).then((data) => {
      this.setState({
        merchantStatistics: data.data.merchantStatistics || [],
        noticeStatistics: data.data.noticeStatistics.count,
        orderStatistics: data.data.orderStatistics || [],
        hasImportant: data.data.noticeStatistics.hasImportant,
      }, () => {
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
  goOrderList(state = '') {
    const params = {
      eventId: 'H5_agentSign_P_orderList',
      args: {
        state,
      },
    };
    _h5t.track('pageview', params);
    window.app.mainView.router.load({
      url: 'p/orderList.html',
      animatePages: true,
      query: {
        state,
        that: this,
      },
    });
  }

  goStaticCode() {
    const params = {
      eventId: 'H5_agentSign_P_staticCode',
    };
    _h5t.track('pageview', params);
    window.app.mainView.router.load({
      url: 'p/staticCode.html',
      animatePages: true,
      query: {
        that: this,
      },
    });
  }

  goMessage(hasImportant = false) {
    const params = {
      eventId: 'H5_agentSign_P_messageList',
      args: {
        hasImportant,
      },
    };
    _h5t.track('pageview', params);
    if (hasImportant) {
      this.setState({
        hasImportant: 'N',
      });
    }
    window.app.mainView.router.load({
      url: 'p/message.html',
      animatePages: true,
      query: {
        that: this,
        hasImportant: hasImportant ? 'Y' : 'N',
      },
    });
  }

  goMerchantList(state = '') {
    const params = {
      eventId: 'H5_agentSign_P_merchantList',
      args: {
        state,
      },
    };
    _h5t.track('pageview', params);
    window.app.mainView.router.load({
      url: 'p/merchantList.html',
      animatePages: true,
      query: {
        state,
        that: this,
      },
    });
  }

  goEnterprise() {
    sessionStorage.setItem('option', 'add');
    window.app.mainView.router.load({
      url: 'p/enterprise-index.html',
      animatePages: true,
      query: {
        that: this,
      },
    });
  }

  orderStatistics(num) {
    let x = 0;
    this.state.orderStatistics.map((value) => {
      if (value.status === num && value.count !== 0) {
        x = <span className={`${s.count}`}>{value.count}</span>;
      }
      return null;
    });
    return x;
  }

  merchantStatistics(num) {
    let x = 0;
    this.state.merchantStatistics.map((value) => {
      if (value.merchantType === num && value.count !== 0) {
        x = <span className={`${s.count}`}>{value.count}</span>;
      }
      return null;
    });
    return x;
  }

  clickHidden() {
    this.setState({
      hidden: true,
    });
  }
  render() {
    return (
      <div className="page" data-page="index">
        <div className="page-content pull-to-refresh-content" data-ptr-distance="55">
          <div className="pull-to-refresh-layer">
            <div className="preloader" />
            <div className="pull-to-refresh-arrow" />
          </div>
          <div className={`content-block ${s.contentUser}`}>
            <div className={`content-block-inner ${s.contentInner}`}>
              <div className={`${s.userAvatar}`}>&nbsp;</div>
              <div className={`${s.userNickName}`}>{this.state.operatorName}</div>
              <div className={`${s.userAccount}`}>{this.state.idContent}</div>
              <div className={`${s.userType}`}>
                <div className={`${s.col}`}>{this.state.userId}</div>
                <div className={`${s.border}`} />
                <div className={`${s.col}`}>{this.state.name}</div>
              </div>
              <a className={`${s.message}`} href="#" onClick={() => this.goMessage()}>&nbsp;</a>
              <div className={`${s.notice} ${this.state.noticeStatistics === 0 ? s.hidden : null}`} onClick={() => this.goMessage()}>
                {this.state.noticeStatistics}
              </div>
              {/* <div className={`${s.userSet}`}>&nbsp;</div> */}
            </div>
          </div>
          <div className={`${s.hint} ${this.state.hasImportant === 'N' ? s.hidden : null} ${this.state.hidden ? s.hidden : null}`}>
            <div className={`${s.xiaoxi}`} onClick={() => this.goMessage(true)}>重要消息通知</div>
            <div className={`${s.hiddenHint}`} onClick={() => this.clickHidden()} />
          </div>
          <div className={`content-block ${s.contentSign}`}>
            <div className={`content-block-inner ${s.signInner}`}>
              <div className="row">
                <div className="col-50">
                  <a href="#" className={`button button-big color-gray ${s.signButton}`} onClick={() => this.goEnterprise()}>
                    <img src={`${require('../../../assets/img/IndexImg/icon_qyshjj_hdpi.png')}`}alt="企业商户进件" />
                    企业商户进件
                  </a>
                </div>
                <div className="col-50">
                  <a href="#" className={`button button-big color-gray ${s.signButton}`}>
                    <img src={`${require('../../../assets/img/IndexImg/icon_grshjj_hdpi.png')}`}alt="个人商户进件" />
                    个人商户进件
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={`content-block ${s.contentMyIndent}`}>
            <div className={`content-block-inner ${s.contentInner}`}>
              <div className={`list-block ${s.myIndent}`}>
                <ul>
                  <li>
                    <a className={`item-link item-content ${s.itemLink}`} href="#" onClick={() => this.goOrderList()}>
                      <div className={`item-inner ${s.innerMyIndent}`}>
                        <div className={`item-title ${s.title}`}>我的订单</div>
                        <div className="item-after">查看全部</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className={`row ${s.myOrderStatus}`}>
                <div className={`col-33 ${s.col}`} onClick={() => this.goOrderList('草稿')}>
                  <div className={`${s.img}`}><img src={`${require('../../../assets/img/IndexImg/icon_cg_hdpi.png')}`} alt="草稿" /></div>
                  <div className={`${s.inner}`}>草稿({this.orderStatistics(101)})</div>
                </div>
                <div className={`col-33 ${s.col}`} onClick={() => this.goOrderList('审批中')}>
                  <div className={`${s.img}`}><img src={`${require('../../../assets/img/IndexImg/icon_shz_hdpi.png')}`} alt="审批中" /></div>
                  <div className={`${s.inner}`}>审批中({this.orderStatistics(115)})</div>
                </div>
                <div className={`col-33 ${s.col}`} onClick={() => this.goOrderList('驳回')}>
                  <div className={`${s.img}`}><img src={`${require('../../../assets/img/IndexImg/icon_bh_hdpi.png')}`} alt="驳回" /></div>
                  <div className={`${s.inner}`}>驳回({this.orderStatistics(112)})</div>
                </div>
              </div>
            </div>
          </div>
          <div className={`content-block ${s.contentMyIndent}`}>
            <div className={`content-block-inner ${s.contentInner}`}>
              <div className={`list-block ${s.myIndent}`}>
                <ul>
                  <li>
                    <a className={`item-content ${s.itemLink}`} href="#" onClick={() => this.goMerchantList('')}>
                      <div className={`item-inner ${s.innerMyIndent}`}>
                        <div className={`item-title ${s.title}`}>我的商户</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div className={`row ${s.myOrderStatus}`}>
                <div className={`col-33 ${s.col}`} onClick={() => this.goMerchantList('个人')}>
                  <div className={`${s.img}`}><img src={`${require('../../../assets/img/IndexImg/icon_gr_hdpi.png')}`} alt="个人" /></div>
                  <div className={`${s.inner}`}>个人({this.merchantStatistics(1)})</div>
                </div>
                <div className={`col-33 ${s.col}`} onClick={() => this.goMerchantList('个体户')}>
                  <div className={`${s.img}`}><img src={`${require('../../../assets/img/IndexImg/icon_gth_hdpi.png')}`} alt="个体户" /></div>
                  <div className={`${s.inner}`}>个体户({this.merchantStatistics(2)})</div>
                </div>
                <div className={`col-33 ${s.col}`} onClick={() => this.goMerchantList('企业')}>
                  <div className={`${s.img}`}><img src={`${require('../../../assets/img/IndexImg/icon_qy_hdpi.png')}`} alt="企业" /></div>
                  <div className={`${s.inner}`}>企业({this.merchantStatistics(0)})</div>
                </div>
              </div>
            </div>
          </div>
          <div className={`content-block ${s.contentMyCode}`}>
            <div className={`content-block-inner ${s.contentInner}`}>
              <div className={`list-block ${s.myCode}`}>
                <ul>
                  <li>
                    <a className="item-link item-content" href="#" onClick={() => this.goStaticCode()}>
                      <div className={`item-media ${s.img}`}>
                        <img src={`${require('../../../assets/img/IndexImg/icon_jtm_hdpi.png')}`} alt="静态码" />
                      </div>
                      <div className={`item-inner ${s.innerMyCode}`}>
                        <div className={`item-title ${s.title}`}>我的静态码</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// function formatParams(data) {
//     var arr = [];
//     for (var name in data) {
//         arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
//     }
//     arr.push(("v=" + Math.random()).replace(".",""));
//     return arr.join("&");
// }
export default Index;
