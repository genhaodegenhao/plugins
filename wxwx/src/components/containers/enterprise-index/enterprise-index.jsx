import React from 'react';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import s from './enterprise-index.less';
import _h5t from '../../../utils/h5t.js';

class EnterpriseIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCerInf: '0', // 企业证件信息是否填写
      isCreditInf: '0', // 征信信息补充
      isProRate: '0', // 产品费率
      isSave: '0', // 是否可以提交
      applyId: '', // 订单id
      storeTerminalList: [], // 门店终端列表
      deleteMark: '0', // 删除标志
    };
    this.getStoreTerminal = this.getStoreTerminal.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
    this.deleteMarkClick = this.deleteMarkClick.bind(this);
    this.cancleDeleteClick = this.cancleDeleteClick.bind(this);
    this.enterpriseInf = this.enterpriseInf.bind(this);
    this.creditInf = this.creditInf.bind(this);
    this.productRateInf = this.productRateInf.bind(this);
    this.storeTerminal = this.storeTerminal.bind(this);
    this.storeEdit = this.storeEdit.bind(this);
    this.submitApply = this.submitApply.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const pages = window.app.onPageInit('p/enterprise-index.html', (page) => {
      if (page.query && page.query.id) { // 有查询参数
        _this.setState({
          applyId: page.query.id,
        }, () => {
          console.log(pages);
          sessionStorage.setItem('applyId', page.query.id);
          _this.getPageStatus(page.query.id);
        });
      } else {
        sessionStorage.removeItem('applyId');
      }
      if (page.query && page.query.status) { // 有status
        if (page.query.status === '112') { // 被驳回
          sessionStorage.setItem('disabled', true);
        } else {
          sessionStorage.removeItem('disabled');
        }
      } else {
        sessionStorage.removeItem('disabled');
      }
    });
  }

  /**
   * 获取页面状态
   */
  getPageStatus(id) {
    const _this = this;
    const option = {
      url: api.apiUrl.pageInfoIsFull,
      data: {
        applyId: id,
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.post(option).then((data) => {
      console.log(data);
      if (data.data && data.data.mlQyzj) {
        _this.setState({ isCerInf: '1' });
      }
      if (data.data && data.data.mlZxbc) {
        _this.setState({ isCreditInf: '1' });
      }
      if (data.data && data.data.mlCpfl) {
        _this.setState({ isProRate: '1' });
      }
      if (data.data && data.data.mlMdzd) {
        _this.setState({ isSave: '1' });
        _this.getStoreTerminal(id);
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 获取门店终端信息
   */
  getStoreTerminal(id) {
    console.log(this);
    const _this = this;
    const option = {
      url: api.apiUrl.applyPageInfo,
      data: {
        applyId: id,
        pageType: 'mlMdzd',
      },
      headers: {
        authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
      },
    };
    fetch.post(option).then((data) => {
      console.log(data);
      if (data.data) {
        _this.setState({
          storeTerminalList: data.data,
        });
      }
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  /**
   * 删除终端点击
   */
  deleteClick() {
    this.setState({ deleteMark: '1' });
  }

  /**
   * 取消删除
   */
  cancleDeleteClick() {
    this.setState({ deleteMark: '0' });
  }

  /**
   * 删除标志点击
   */
  deleteMarkClick(e) {
    const _this = this;
    const storeid = e.target.getAttribute('data-id');
    window.app.confirm('确认要删除该门店及其终端/台卡信息吗？', '删除提示',
      () => { // 确定按钮
        const option = {
          url: api.apiUrl.storeDelete,
          data: {
            applyId: _this.state.applyId,
            idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
            storeId: storeid,
          },
          headers: {
            authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
          },
        };
        fetch.post(option).then((data) => {
          console.log(data);
          _this.getStoreTerminal(_this.state.applyId);
          _this.setState({ deleteMark: '0' });
        }).catch((error) => {
          window.app.alert(error.message);
        });
      },
      () => { // 取消按钮
        _this.setState({ deleteMark: '0' });
      }
    );
  }

  /**
   * 门店编辑
   */
  /* eslint-disable */
  storeEdit(e) {
    const _this = this;
    const storeid = e.target.getAttribute('data-id');
    _this.state.storeTerminalList.map((item, index) => {
      console.log(index);
      if (item.storeId === storeid) {
        window.app.mainView.router.load({
          url: 'p/store-terminal.html',
          animatePages: true,
          query: {
            id: _this.state.applyId,
            storeTerminalMessage: item,
          },
        });
      }
    });
  }
  /**
   * 企业信息跳转
   */
  enterpriseInf() {
    const _this = this;
    $$('#cardStartEnd').remove();
    $$('#cardEndDate').remove();
    window.app.mainView.router.load({
      url: 'p/enterprise-inf.html',
      animatePages: true,
      query: {
        id: _this.state.applyId,
      },
    });
  }

  /**
   * 征信信息补充
   */
  creditInf() {  //eslint-disable-line
    const _this = this;
    if (_this.state.isCerInf === '1') {
      $$('#startDate').remove();
      $$('#endDate').remove();
      window.app.mainView.router.load({
        url: 'p/credit-inf.html',
        animatePages: true,
        query: {
          id: _this.state.applyId,
        },
      });
    } else {
      window.app.alert('请按顺序填写信息！');
    }
  }

  /**
   * 产品费率跳转
   */
  productRateInf() {  //eslint-disable-line
    const _this = this;
    if (_this.state.isCreditInf === '1') {
    window.app.mainView.router.load({
      url: 'p/product-rate-inf.html',
      animatePages: true,
      query: {
        id: _this.state.applyId,
      },
    });
    } else {
      window.app.alert('请按顺序填写信息！');
    }
  }

  /**
   * 新增门店
   */
  storeTerminal() {  //eslint-disable-line
    const _this = this;
    if (_this.state.isProRate === '1') {
      window.app.mainView.router.load({
        url: 'p/store-terminal.html',
        animatePages: true,
        query: {
          id: _this.state.applyId,
        },
      });
    } else {
      window.app.alert('请按顺序填写信息！');
    }
  }

  /**
   * 提交审核
   */
  submitApply() {
    const _this = this;
    if (_this.state.isSave === '1') {
      // 征信补充页面信息保存埋点
      const param = {
        eventId: 'H5_agentSign_submitApply',
        args: {
          applyId: _this.state.applyId,
          idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
          userId: sessionStorage.getItem('userid'),
        },
      };
      _h5t.track('trackevent', param);
      const option = {
        url: api.apiUrl.applySubmit,
        data: {
          applyId: _this.state.applyId,
          idContent: JSON.parse(sessionStorage.getItem('userInfo')).idContent,
          userId: sessionStorage.getItem('userid'),
        },
        headers: {
          authorization: JSON.parse(sessionStorage.getItem('dataList')).token,
        },
      };
      fetch.post(option).then((data) => {
        sessionStorage.removeItem('option');
        sessionStorage.removeItem('saveType');
        window.app.mainView.router.load({
          url: 'p/index.html',
          animatePages: true,
          pushState: false,
        });
      }).catch((error) => {
        window.app.alert(error.message);
      });
    }
  }

  render() {
    return (
      <div className={s.wrapper}>
        <ul className={s.credentialsMessage}>
          <li className={`clearfix ${s.credentialItem}`} onClick={this.enterpriseInf}>
            <span className="fl">* 企业证件信息</span>
            <i className={this.state.isCerInf === '1' ? `fr ${s.finfish}` : 'fr'}>{this.state.isCerInf === '1' ? '已完成' : '请填写'}</i>
          </li>
          <li className={`clearfix ${s.credentialItem}`} onClick={this.creditInf}>
            <span className="fl">* 征信信息补充</span>
            <i className={this.state.isCreditInf === '1' ? `fr ${s.finfish}` : 'fr'}>{this.state.isCreditInf === '1' ? '已完成' : '请填写'}</i>
          </li>
          <li className={`clearfix ${s.credentialItem}`} style={{ border: 'none' }} onClick={this.productRateInf}>
            <span className="fl">* 产品费率信息</span>
            <i className={this.state.isProRate === '1' ? `fr ${s.finfish}` : 'fr'}>{this.state.isProRate === '1' ? '已完成' : '请填写'}</i>
          </li>
        </ul>
        <ul className={s.storeMessage}>
          <li className={s.credentialItem}>
            <span className="fl">* 门店终端信息</span>
          </li>
          <ul className={`clearfix ${s.terminal}`}>
            {
              this.state.storeTerminalList.map((item, rowIndex) => {
                return (
                  <li keys={rowIndex} className={`fl ${s.terminalItem}`}>
                    <i className="ell" data-id={item.storeId} onClick={this.storeEdit}>{item.storeName}</i>
                    <span className={this.state.deleteMark === '1' ? `show ${s.deleteMark}` : 'hide'} data-id={item.storeId} onClick={this.deleteMarkClick}>&nbsp;</span>
                  </li>
                );
              })
            }
            <li className={`fl ${s.terminalItem}`} onClick={this.storeTerminal}><span className={s.deleteBtn}>+</span></li>
          </ul>
          <li className={s.credentialItem}>
            <span style={{ color: '#6a9cd9' }} onClick={this.deleteClick}>删除终端</span>
            <i className="fr" onClick={this.cancleDeleteClick}>取消</i>
          </li>
        </ul>
        <p className={s.tip}>带*项为必填信息</p>
        <div className={s.btnWrapper}>
          <button className={this.state.isSave === '1' ? `${s.save}` : null} onClick={this.submitApply}>提交审核</button>
        </div>
      </div>
    );
  }
}

export default EnterpriseIndex;
