import React from 'react';
import s from './StaticCode.less';
import fetch from '../../../backend/fetch.js';
// import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';
import _h5t from '../../../utils/h5t.js';

class StaticCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      codeList: [],
      currentPage: 1,
      pageSize: 10,
    };
  }

  componentWillMount() {
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const token = dataList.token;
    this.setState({
      token,
    });
    // let opts = {
    //   currentPage: this.state.currentPage,
    //   pageSize: this.state.pageSize,
    // };
    // opts = utils.formatParams(opts);
    const conf = {
      // url: `${baseUrl}/mobile/queryStaticCodeList?memberCode=10012398516`,
      url: `${baseUrl2}/mobile/queryStaticCodeList`,
      headers: {
        authorization: token,
      },
    };
    fetch.get(conf).then((data) => {
      this.setState({
        codeList: data.data || [],
      });
    }).catch((error) => {
      window.app.toast(error.message);
    });
  }

  componentDidMount() {
    window.app.searchbar('.searchbar', {
      searchList: '.list-block-search',
      searchIn: '.item-title, .item-no',
    });
  }

  clickCode(value) {
    const params = {
      eventId: 'H5_agentSign_P_code',
    };
    _h5t.track('pageview', params);
    console.log(this);
    window.app.mainView.router.load({
      url: 'p/showCode.html',
      animatePages: true,
      query: {
        fssId: value || '',
      },
    });
  }
  renderCodeList(value) {
    return (
      <li className="item-content">
        <div className="item-inner row no-gutter">
          <div className={`item-title col-60 ${s.title}`}>
            {value.merchantName}
          </div>
          <div className={`item-no col-20 ${s.center}`}>
            {value.seqId}
          </div>
          <div className={`col-20 ${s.right}`}>
            <div onClick={() => this.clickCode(value.fssId)}>
              <img src={`${require('../../../assets/img/IndexImg/icon_Download_hdpi.png')}`} alt="" />
            </div>
          </div>
        </div>
      </li>
    );
  }
  render() {
    return (
      <div className="page" data-page="StaticCode">
        <form className={`searchbar ${s.searchbar}`} data-search-list=".list-block-search" data-search-in=".item-title">
          <div className="searchbar-input">
            <input type="search" placeholder="商户名称查询" />
            <a href="#" className="searchbar-clear">&nbsp;</a>
          </div>
          <a href="#" className="searchbar-cancel">取消</a>
        </form>
        <div className={`page-content ${s.pageContent}`}>
          <div className="content-block searchbar-not-found" />
          <div className={`content-block ${s.content}`}>
            <div className={`content-block-inner ${s.contentInner} row`}>
              <div className={`col-50 ${s.col}`}>商户名称</div>
              <div className={`col-25 ${s.col} ${s.colR}`}>序列号</div>
              <div className={`col-25 ${s.col} ${s.colR}`}>台卡付</div>
            </div>
          </div>
          <div className={`list-block list-block-search searchbar-found ${s.listBlock}`}>
            <ul>
              {/* <li className="item-content">
                <div className="item-inner row no-gutter">
                  <div className={`item-title col-60 ${s.title}`}>
                      南京黑脸娃娃有限公司
                  </div>
                  <div className={`item-no col-20 ${s.center}`}>
                    1234
                  </div>
                  <div className={`col-20 ${s.right}`}>
                    <div onClick={() => this.clickCode()}>
                      <img
                        src={`${require('../../../assets/img/IndexImg/icon_Download_hdpi.png')}`}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </li> */}
              {this.state.codeList.map((value, index) => this.renderCodeList(value, index))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default StaticCode;
