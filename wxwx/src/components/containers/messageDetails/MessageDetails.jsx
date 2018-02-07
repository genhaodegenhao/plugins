import React from 'react';
import s from './messageDetails.less';
import fetch from '../../../backend/fetch.js';
import utils from '../../../utils/utils.js';
import { baseUrl2 } from '../../../backend/mixins/api';

class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      content: {},
    };
  }

  componentWillMount() {
    const dataList = JSON.parse(sessionStorage.getItem('dataList'));
    const token = dataList.token;
    const PageInit = window.app.onPageInit('p/messageDetails.html', (page) => {
      this.setState({
        id: page.query.id || '',
      }, () => {
        PageInit.remove();
        let opts = {
          id: this.state.id,
        };
        opts = utils.formatParams(opts);
        const conf = {
          // url: 'http://localhost:8888/messageDetails',
          url: `${baseUrl2}/mobile/queryNoticeDetail?${opts}`,
          headers: {
            authorization: token,
          },
        };
        fetch.get(conf).then((data) => {
          this.setState({
            content: data.data,
          });
        }).catch((error) => {
          window.app.toast(error.message);
        });
      });
    });
  }

  componentDidMount() {

  }

  clickAttach() {
    console.log(this.state.id);
    window.app.modal({
      text: '请到PC端快钱官网查看附件',
      buttons: [
        {
          text: '知道了',
          onClick: () => {
          },
        },
      ],
    });
  }

  render() {
    return (
      <div className="page" data-page="messageDetails">
        <div className={`page-content ${s.pageContent}`}>
          <div className={`content-block inset ${s.contentInset}`}>
            <div className={`content-block-inner ${s.contentInner}`}>
              <div className={`${s.innerHeader}`}>
                <div className={`${s.title}`}>{this.state.content.title}</div>
                <div className={`${s.time}`}>{this.state.content.date}</div>
                <div className={`${s.attach} ${this.state.content.hasAttach === 'Y' ? null : s.hidden}`} onClick={() => this.clickAttach()} />
              </div>
              <div className={`${s.content}`}>{this.state.content.noticeContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MessageDetails;
