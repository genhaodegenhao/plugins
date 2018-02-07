import React from 'react';
import utils from '../../../utils/utils.js';
import s from './h5-upload.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
    };
    this.inputOnchage = this.inputOnchage.bind(this);
    this.scanQRCode = this.scanQRCode.bind(this);
  }

  componentDidMount() {
  }

  inputOnchage(e) {
    const file = e.target;
    this.setState({ file: file.files[0] });
    utils.uploadChange(file);
  }

  scanQRCode() {
    this.setState({ file: '' });
    console.log(window.WeixinJSBridge);
    // window.WeixinJSBridge.call('hideToolbar');
    // window.WeixinJSBridge.invoke("scanQRCode",{
    //     })
    // // window.WeixinJSBridge.invoke('scanQRCode', {

    // // },
    // // res => console.log(res)
    // // );
  }

  render() {
    return (
      <div className={s.wrapper}>
        <div className={s.btnWrapper}>
          <input type="text" />
          <button>1</button>
          <input id="upload"className={s.uploadInput} name="upload" type="file" accept="image/*" onChange={this.inputOnchage} />
        </div>
      </div>
    );
  }
}

export default Index;
