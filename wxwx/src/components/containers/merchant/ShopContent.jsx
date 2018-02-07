import s from './ShopContent.less';

const ShopContent = (props) => {
  const value = props.this.state.terminalInfo || [];
  const terminalType = (val) => {
    let x = '';
    switch (val) {
      case '1':
        x = '固网CP';
        break;
      case '2':
        x = '移动CP';
        break;
      case '3':
        x = '快刷';
        break;
      case '4':
        x = '智能终端';
        break;
      case '5':
        x = '快钱刷';
        break;
      case '6':
        x = '轻快付';
        break;
      default:
        break;
    }
    return x;
  };
  const tmList = (val) => {
    return (
      `终端类型:${terminalType(val.terminalType)},终端数量:${val.terminalCnt} `
    );
  };
  const gscList = (val) => {
    return (
      `台卡名称:${val.qrCodeName},终端编号:${val.terminalId} `
    );
  };
  const terminalInfo = (val) => {
    return (
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList} ${s.Inner1}`}>
            <div className={`${s.left}`}>门店信息</div>
          </div>
        </div>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>门店名称</div>
            <div className={`${s.right}`}>{val.storeName}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>联系人&电话</div>
            <div className={`${s.right}`}>{val.storeContact} {val.storeContactMeans}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>门店地址</div>
            <div className={`${s.right}`}>{val.storeAddress}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>门店终端</div>
            <div className={`${s.right}`}>{val.tmList ? val.tmList.map((val1, index) => tmList(val1, index)) : null}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>静态码台卡付</div>
            <div className={`${s.right}`}>{val.gscList ? val.gscList.map((val2, index) => gscList(val2, index)) : null}</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {value.map((val, index) => terminalInfo(val, index))}
    </div>
  );
};

export default ShopContent;
