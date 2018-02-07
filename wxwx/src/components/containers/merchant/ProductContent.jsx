import s from './ProductContent.less';

const ProductContent = (props) => {
  const value = props.this.state.productInfo;
  const cpInfo = value.cpInfo || {};
  const mpInfo = value.mpInfo || {};
  const tmInfo = value.tmInfo || [];
  const gscInfo = value.gscInfo || {};
  const terminal = (val) => {
    return `台卡名称:${val.qrCodeName},终端编号:${val.terminalId} `;
  };
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
  const renderTmInfo = (val) => {
    let x = '';
    let y = '';
    x = val.terminalType ? `终端类型:${terminalType(val.terminalType)},` : '';
    y = val.terminalCnt ? `终端数量:${val.terminalCnt} ` : '';
    x = x.concat(y);
    return x;
  };
  return (
    <div>
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList} ${s.Inner1}`}>
            <div className={`${s.left}`}>CP刷卡支付</div>
          </div>
        </div>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>CP商编</div>
            <div className={`${s.right}`}>{cpInfo.cuRateDebit ? `借记卡${cpInfo.cuRateDebit}% ` : null}{cpInfo.cuDebitMaxFee ? `封顶${cpInfo.cuDebitMaxFee}元 ` : null}{cpInfo.cuRateCredit ? `贷记卡${cpInfo.cuRateCredit}% ` : null}{cpInfo.maxTxnAmt ? `单笔限额${cpInfo.maxTxnAmt}元 ` : null}{cpInfo.salesDailyQuota ? `单日限额${cpInfo.salesDailyQuota}元` : null}</div>
          </div>
        </div>
      </div>
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>MP移动支付</div>
            <div className={`${s.right}`}>{mpInfo.weixinRate ? `微信${mpInfo.weixinRate}% ` : null}{mpInfo.zhifubaoRate ? `支付宝${mpInfo.zhifubaoRate}%` : null}{mpInfo.cuRateDebit ? `银二借记卡${mpInfo.cuRateDebit}% ` : null}{mpInfo.cuDebitMaxFee ? `封顶${mpInfo.cuDebitMaxFee}元 ` : null}{mpInfo.cuRateCredit ? `贷记卡${mpInfo.cuRateCredit}% ` : null}{mpInfo.smallDiscountRate ? `小额优惠${mpInfo.smallDiscountRate}% ` : null}</div>
          </div>
        </div>
      </div>
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>TM终端</div>
            <div className={`${s.right}`}>{tmInfo.map((val1, index) => renderTmInfo(val1, index))}</div>
          </div>
        </div>
      </div>
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>静态码台卡付</div>
            <div className={`${s.right}`}>{gscInfo.assetsId ? `CP商编:${gscInfo.assetsId} ` : null}{gscInfo.qrcCode ? `QRC商编:${gscInfo.qrcCode} ` : null}{gscInfo.terminalList ? gscInfo.terminalList.map((val, index) => terminal(val, index)) : null}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductContent;
