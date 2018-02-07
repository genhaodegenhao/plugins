import React from 'react';
import s from './Order.less';
import fetch from '../../../backend/fetch.js';
import Details from './Details.jsx';
import ApprovalLog from './ApprovalLog.jsx';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarClick: 1, // 页面状态
      orderId: null,
      token: null,
      data: {},
    };
  }

  componentWillMount() {
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const token = dataList.token;
    this.setState({
      token,
    });
    const PageInit = window.app.onPageInit('p/order.html', (page) => {
      this.setState({
        orderId: page.query.orderId,
      }, () => {
        PageInit.remove();
        let opts = {
          orderId: this.state.orderId,
        };
        opts = utils.formatParams(opts);
        const conf = {
          url: `${baseUrl2}/mobile/queryOrderDetail?${opts}`,
          headers: {
            authorization: this.state.token,
          },
        };
        fetch.get(conf).then((data) => {
          this.setState({
            data: data.data,
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

  timeBack() {
    this.setState({
      navbarClick: 0,
    });
  }

  render() {
    return (
      <div className="page" data-page="merchantList">
        <div className="page-content">
          <div className={`${s.navbar} row no-gutter`}>
            <div
              className={`col-50 ${s.navbarCol} ${this.state.navbarClick === 1 ? s.click : null}`}
              onClick={() => this.navbarClick(1)}
            >
              详情
            </div>
            <div
              className={`col-50 ${s.navbarCol} ${this.state.navbarClick === 2 ? s.click : null}`}
              onClick={() => this.navbarClick(2)}
            >
              审批日志
            </div>
          </div>
          <div className={`${s.contentBlock}`}>
            {this.state.navbarClick === 1 ? <Details this={this} /> : null}
            {this.state.navbarClick === 2 ? <ApprovalLog this={this} /> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Order;
