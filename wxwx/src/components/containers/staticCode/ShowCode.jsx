import React from 'react';
import s from './ShowCode.less';
import fetch from '../../../backend/fetch.js';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';


class ShowCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fssId: null,
      imgUrl: null,
    };
  }

  componentWillMount() {
    const dataList = JSON.parse(sessionStorage.getItem('dataList')) || {};
    const token = dataList.token;
    const PageInit = window.app.onPageInit('p/showCode.html', (page) => {
      this.setState({
        fssId: page.query.fssId || null,
      }, () => {
        PageInit.remove();
        let opts = {
          fssId: this.state.fssId,
        };
        opts = utils.formatParams(opts);
        const conf = {
          url: `${baseUrl2}/mobile/downLoadStaticCode?${opts}`,
          headers: {
            authorization: token,
          },
        };
        fetch.get(conf).then((data) => {
          this.setState({
            imgUrl: data.data.imageBase64 || null,
          });
        }).catch((error) => {
          window.app.toast(error.message);
        });
      });
    });
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="page" data-page="StaticCode">
        <div className={`page-content ${s.pageContent}`}>
          {this.state.imgUrl ? <div className={`${s.contentImg}`}>
            <img src={this.state.imgUrl} alt="静态码" />
          </div> : null}
          {/* <div className={`${s.contentImg}`}>
            保存到相册
          </div> */}
        </div>
      </div>
    );
  }
}

export default ShowCode;
