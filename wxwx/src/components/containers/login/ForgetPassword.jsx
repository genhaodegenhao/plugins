import React from 'react';
import _h5t from '../../../utils/h5t';
import '../../../assets/css/mod_css/login.css';
import kuaiqianLogo from '../../../assets/img/login/top-logo.png';

class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
    };
  }

  componentDidMount() {
    _h5t.track('pageview', {
      eventId: 'H5_agentSign_P_forgetpassword',
    });
  }

  render() {
    return (
      <div className="page" style={{ background: '#fff' }} data-page="Login">
        <div className="page-content">
          <div className="login-screen-title">
            <img className="kuaiqianlogo" src={kuaiqianLogo} alt="" />
          </div>
          <div className="reset-form">
            <div className="reset-text">
              当您忘记密码时：
              <ul>
                <li>1. 您可通过微信公众号“快钱支付企业客服中心”——【我要办理】——【商户自助服务】——【快钱账户密码重置】进行自助申请。</li>
                <li>&nbsp;</li>
                <li>2. 您也可通过快钱官网下载 “单位快钱账户密码重置”申请单并打印，
                填写完整信息后（盖公章），和公司营业执照副本复印件（盖公章）、经办人身份证复印件（盖公章）并在9:00-18:00微信回复“人工”联系在线客服帮您找回密码。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgetPassword;
