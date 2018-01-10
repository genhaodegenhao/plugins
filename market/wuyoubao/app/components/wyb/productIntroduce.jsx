import React from 'react'
import './style.scss'
import backgroundPic from './images/wuyoubaobg.png';
import msgPic from './images/msg.png';
import telPic from './images/tel.png';

export default class ProductIntroduce extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.state = {

        }
    }

    componentWillMount() {

    }
    handleMsg() {
        alert('咨询');
    }
    handleTel() {
        alert('电话');
    }
    handleSubmit() {
        window.location.href = 'https://oms-cloud.99bill.com/stage2/html/app-base/auth/index.html?appid=wd213e07v94b5f2a92&response_type=code&scope=1&redirect_uri=https://m.shebaoonline.com';
    }

    render() {
        return (
            <div>
                <div className="bg-class"><img src={backgroundPic} alt=""/></div>
                <div className="fix-box">
                    <div className="msg" onClick={this.handleMsg}>
                        <img src={msgPic} alt=""/><br/>
                        <span>咨询</span>
                    </div>
                    <div className="tel" onClick={this.handleTel}>
                        <img src={telPic} alt=""/><br/>
                        <span>电话</span>
                    </div>
                    <div className="btn-makesure" onClick={this.handleSubmit}>我要參保</div>
                </div>
            </div>
        )
    }

}