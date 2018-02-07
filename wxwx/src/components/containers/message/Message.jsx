import React from 'react';
import s from './Message.less';
import fetch from '../../../backend/fetch.js';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';
import _h5t from '../../../utils/h5t.js';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList: [], // 通知列表，
      currentPage: 1, // 当前页码
      pageSize: 10, // 页面大小
      total: 0, // 总条数
      loading: false, // 上拉加载状态  false为可以加载
      hiddenScroll: false, // 是否隐藏上拉加载进度条
      token: null,
      _this: null,
      hasImportant: 'N', // 是否只查重要信息
    };
  }

  componentWillMount() {
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const token = dataList.token;
    this.setState({
      token,
    });
    const PageInit = window.app.onPageInit('p/message.html', (page) => {
      this.setState({
        _this: page.query.that || '',
        hasImportant: page.query.hasImportant || 'N',
        token,
      }, () => {
        PageInit.remove();
        this.messageList();
      });
    });
  }

  componentDidMount() {
    window.$$('.pull-to-refresh-content').on('refresh', () => {
      // 请求messageList接口
      this.messageList(() => window.app.pullToRefreshDone(), true, 1);
    });
    window.$$('.infinite-scroll').on('infinite', () => {
      if (this.state.messageList.length >= this.state.total || this.state.loading) return;
      this.setState({
        loading: true,
      });
      let opts = {
        currentPage: this.state.currentPage + 1,
        pageSize: this.state.pageSize,
        isImportant: this.state.hasImportant === 'N' ? '0' : '1',
      };
      opts = utils.formatParams(opts);
      const conf = {
        // url: 'http://192.168.127.149:8091/app-mbp-website-gw/coe-moss-querysrv/mobile/queryNoticeList',
        url: `${baseUrl2}/mobile/queryNoticeList?${opts}`,
        headers: {
          authorization: this.state.token,
        },
      };
      fetch.get(conf).then((data) => {
        const messageList = [...this.state.messageList, ...data.data.list];
        this.setState({
          messageList,
          loading: false,
          currentPage: this.state.currentPage + 1,
        }, () => {
          if (this.state.messageList.length >= this.state.total) {
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

  clickMessage(value) {
    const params = {
      eventId: 'H5_agentSign_P_message',
    };
    _h5t.track('pageview', params);
    if (value.state === '3') {
      if (this.state._this) {
        this.state._this.setState({
          noticeStatistics: this.state._this.state.noticeStatistics - 1,
        });
      }
      let opts = {
        id: value.id,
      };
      opts = utils.formatParams(opts);
      const conf = {
        // url: 'http://192.168.127.149:8091/app-mbp-website-gw/coe-moss-querysrv/mobile/readNotice',
        url: `${baseUrl2}/mobile/readNotice?${opts}`,
        loader: true,
        headers: {
          authorization: this.state.token,
        },
      };
      fetch.get(conf).then((data) => {
        console.log(data, '未读请求成功');
      });
    }
    // 跳转到消息详情页面
    window.app.mainView.router.load({
      url: 'p/messageDetails.html',
      animatePages: true,
      query: {
        id: value.id,
      },
    });
  }

  messageList(callback, loader = false, currentPage) {
    window.$$('.infinite-scroll')[0].scrollTop = 0;
    let opts = {
      currentPage: currentPage || this.state.currentPage,
      pageSize: this.state.pageSize,
      isImportant: this.state.hasImportant === 'N' ? '0' : '1',
    };
    opts = utils.formatParams(opts);
    const conf = {
      // url: 'http://localhost:8888/messageList',
      url: `${baseUrl2}/mobile/queryNoticeList?${opts}`,
      headers: {
        authorization: this.state.token,
      },
    };
    conf.loader = loader;
    fetch.get(conf).then((data) => {
      this.setState({
        messageList: data.data.list || [],
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
    });
  }

  renderMessageList(value) {
    return (
      <div>
        <div className={`content-block-title ${s.contentTime}`}>{value.date}</div>
        <div className={`content-block inset ${s.contentInset}`} onClick={() => this.clickMessage(value)}>
          <div className={`content-block-inner ${s.contentInner}`}>
            <div className={`${s.title}`}>{value.title}</div>
            <div className={`${s.inner}`}>{value.contentSummary}</div>
            <div className={`list-block ${s.listBlock}`}>
              <ul>
                <li className={`item-link item-content ${s.itemLink}`}>
                  <div className={`item-inner ${s.itemInner}`}>
                    <div className="item-title">查看详情</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="page" data-page="message">
        <div className={`page-content ${s.pageContent} pull-to-refresh-content infinite-scroll`} data-ptr-distance="70" data-distance="100">
          <div className="pull-to-refresh-layer">
            <div className="preloader" />
            <div className="pull-to-refresh-arrow" />
          </div>
          {this.state.messageList.map((value, index) => this.renderMessageList(value, index))}
          <div className={`infinite-scroll-preloader ${s.scrollPreloader} ${this.state.hiddenScroll ? s.hidden : s.hidden}`}>
            <div className="preloader" />
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
