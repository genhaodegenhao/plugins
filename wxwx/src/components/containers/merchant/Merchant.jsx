import React from 'react';
import s from './Merchant.less';
import fetch from '../../../backend/fetch.js';
import MerchantContent from './MerchantContent.jsx';
import AccountContent from './AccountContent.jsx';
import ProductContent from './ProductContent.jsx';
import ShopContent from './ShopContent.jsx';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';

class Merchant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarClick: 1, // 页面状态
      token: null,
      billAccount: null,
      memberCode: null,
      merchantCode: null,
      accountInfo: {}, // 账户信息
      merchantInfo: {}, // 商户信息
      productInfo: {}, // 产品信息
      terminalInfo: [], // 门店信息
    };
  }

  componentWillMount() {
    // session中获取数据
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const token = dataList.token;
    this.setState({
      token,
    });
    const PageInit = window.app.onPageInit('p/merchant.html', (page) => {
      this.setState({
        billAccount: page.query.billAccount,
        memberCode: page.query.memberCode,
        merchantCode: page.query.merchantCode,
      }, () => {
        PageInit.remove();
        let opts = {
          billAccount: this.state.billAccount,
          memberCode: this.state.memberCode,
          merchantCode: this.state.merchantCode,
        };
        opts = utils.formatParams(opts);
        const conf = {
          // url: `${baseUrl}/mobile/queryMerchantDetail?
          // userId=admin&memberCode=10209976086&merchantCode=3020788&billAccount=anna面包店`,
          url: `${baseUrl2}/mobile/queryMerchantDetail?${opts}`,
          headers: {
            authorization: this.state.token,
          },
        };
        fetch.get(conf).then((data) => {
          this.setState({
            accountInfo: data.data.accountInfo || {},
            merchantInfo: data.data.merchantInfo || {},
            productInfo: data.data.productInfo || {},
            terminalInfo: data.data.terminalInfo || [],
          });
        }).catch((error) => {
          window.app.toast(error.message);
        });
      });
    });
  }

  componentDidMount() {

  }

  navbarClick(num) {
    this.setState({
      navbarClick: num,
      showHistory: true,
    });
  }

  render() {
    return (
      <div className="page" data-page="merchantList">
        <div className="page-content">
          <div className={`${s.navbar} row no-gutter`}>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 1 ? s.click : null}`}
              onClick={() => this.navbarClick(1)}
            >
              商户
            </div>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 2 ? s.click : null}`}
              onClick={() => this.navbarClick(2)}
            >
              账户
            </div>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 3 ? s.click : null}`}
              onClick={() => this.navbarClick(3)}
            >
              产品
            </div>
            <div
              className={`col-25 ${s.navbarCol} ${this.state.navbarClick === 4 ? s.click : null}`}
              onClick={() => this.navbarClick(4)}
            >
              门店
            </div>
          </div>
          <div className={`${s.contentBlock}`}>
            {this.state.navbarClick === 1 ? <MerchantContent this={this} /> : null}
            {this.state.navbarClick === 2 ? <AccountContent this={this} /> : null}
            {this.state.navbarClick === 3 ? <ProductContent this={this} /> : null}
            {this.state.navbarClick === 4 ? <ShopContent this={this} /> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Merchant;
