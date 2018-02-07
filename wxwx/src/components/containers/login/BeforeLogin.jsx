import React from 'react';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import _h5t from '../../../utils/h5t';
import '../../../assets/css/mod_css/login.css';
import kuaiqianLogo from '../../../assets/img/login/top-logo.png';

class BeforeLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      flag: false,
    };
  }

  componentDidMount() {
    this.getValues();
    _h5t.track('pageview', {
      eventId: 'H5_agentSign_P_beforelogin',
    });
  }

  getValues = () => {
    const valu = window.localStorage.getItem('kq_valu');
    if (valu !== null) {
      this.setState({
        userName: valu,
      });
    }
  }

  handleOnChange(e) {
    e.stopPropagation();
    this.setState({
      userName: e.target.value,
    });
  }

  handleSubmit(e) {
    e.stopPropagation();
    const MATCH_MOBILE = new RegExp(/^1[34578]\d{9}$/);
    const MATCH_EMAIL = new RegExp(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/);
    const userName = this.state.userName.replace(/(^\s*)|(\s*$)/g, '');

    if (!userName) {
      window.app.alert('用户名不能为空');
      return;
    }
    if (!MATCH_MOBILE.test(userName) && !MATCH_EMAIL.test(userName)) {
      window.app.alert('用户名必须为手机号或邮箱');
      return;
    }
    const option = {
      url: api.apiUrl.getUserList,
      data: {
        idContent: userName,
      },
    };
    fetch.post(option).then((data) => {
      sessionStorage.setItem('userInfo', JSON.stringify({ idContent: userName }));
      sessionStorage.setItem('operLists', JSON.stringify(data.userList));
      sessionStorage.setItem('memberCode', JSON.stringify(data.memberCode));
      window.localStorage.setItem('kq_valu', userName);
      _h5t.track('trackevent', {
        eventId: 'H5_agentSign_beforelogin',
      });
      window.app.mainView.router.load({
        url: 'p/login.html',
        animatePages: true,
      });
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  render() {
    return (
      <div className="page" style={{ background: '#fff' }} data-page="BeforeLogin">
        <div className="page-content">
          <div className="login-screen-title">
            <img className="kuaiqianlogo" src={kuaiqianLogo} alt="" />
          </div>
          <form className="beforeloginform list-block">
            <div className="item-content">
              <div className="item-inner">
                <div className="item-title label">用户名</div>
                <div className="item-input">
                  <input style={{ lineHeight: '24px' }} className="formInput" type="text" onChange={() => this.handleOnChange(event)} maxLength="32" placeholder="请输入电子邮箱或手机号" name="name" value={this.state.userName} />
                </div>
              </div>
            </div>
            <div className="checkButton">
              <a href="#" className={`item-link buttonDefault ${this.state.userName.replace(/(^\s*)|(\s*$)/g, '').length > 0 ? '' : 'disabled'}`} onClick={() => this.handleSubmit(event)}>下一步</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default BeforeLogin;
