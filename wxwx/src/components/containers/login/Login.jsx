import React from 'react';
import api from '../../../backend/mixins/api';
import fetch from '../../../backend/fetch';
import _h5t from '../../../utils/h5t';
import '../../../assets/css/mod_css/login.css';
import kuaiqianLogo from '../../../assets/img/login/top-logo.png';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: JSON.parse(sessionStorage.getItem('operLists'))[0].userid,
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      memberCode: JSON.parse(sessionStorage.getItem('memberCode')),
      operLists: JSON.parse(sessionStorage.getItem('operLists')),
      password: '',
      flag: false,
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_agentSign_P_login',
    });
  }

  handleChangeForPassWord(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleOnChangeForSelect(e) {
    this.setState({
      userid: e.target.value,
    });
  }

  handleSubmit() {
    if (!this.state.password) {
      window.app.alert('密码不能为空');
      return;
    }
    const option = {
      url: api.apiUrl.getUserInfo,
      data: {
        memberCode: this.state.memberCode,
        password: this.state.password,
        userId: this.state.userid,
      },
    };
    fetch.post(option).then((data) => {
      sessionStorage.setItem('userid', JSON.stringify(this.state.userid));
      sessionStorage.setItem('dataList', JSON.stringify(data));
      const params = {
        eventId: 'H5_agentSign_login',
        args: {
          userid: this.state.userid,
        },
      };
      _h5t.track('trackevent', params);
      window.app.mainView.router.load({
        url: 'p/index.html',
        animatePages: true,
      });
    }).catch((error) => {
      window.app.alert(error.message);
    });
  }

  render() {
    const userName = this.state.userInfo.idContent;
    return (
      <div className="page" style={{ background: '#fff' }} data-page="Login">
        <div className="page-content">
          <div className="login-screen-title">
            <img className="kuaiqianlogo" src={kuaiqianLogo} alt="" />
          </div>
          <form className="loginForm list-block">
            <div className="item-content">
              <div className="item-inner">
                <div className="item-title label">用户名</div>
                <div className="item-input">
                  <input type="text" className="form-input" disabled="disabled" value={userName} maxLength="30" />
                </div>
              </div>
            </div>
            <div className="item-content">
              <div className="item-inner">
                <div className="item-title label">操作员</div>
                <div className="item-input">
                  <select className="form-select" data-tap-disabled="true" onChange={() => this.handleOnChangeForSelect(event)}>
                    {
                      this.state.operLists.map((item) => {
                        return <option value={item.userid}>{item.userid}</option>;
                      })
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="item-content">
              <div className="item-inner">
                <div className="item-title label">密码</div>
                <div className="item-input">
                  <input style={{ lineHeight: '24px' }} className="formInput" type="password" placeholder="请输入密码" onChange={() => this.handleChangeForPassWord(event)} maxLength="30" />
                </div>
              </div>
            </div>
            <div className="checkButton">
              <a href="#" className={`item-link buttonDefault ${this.state.password.length > 0 ? '' : 'disabled'}`} onClick={() => this.handleSubmit(event)}>立即登录</a>
            </div>
          </form>
          <div className="fixed-layer login-fixed-layer">
            <a href="p/forgetPassword.html" className="reset-link">
              忘记密码?
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
