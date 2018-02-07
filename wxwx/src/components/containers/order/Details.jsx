import s from './Details.less';

const Details = (props) => {
  let value = {};
  value = Object.assign({
    mlCpflJson: {
      cpProductRate: {},
      qrCodeProductRate: {},
    },
    mlMdzdJson: [
      {
        qrCodeList: [],
        terminalList: [],
      },
    ],
  }, props.this.state.data);
  const cpProductRate = value.mlCpflJson.cpProductRate || {};
  const qrCodeProductRate = value.mlCpflJson.qrCodeProductRate || {};
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
  const pos = (val2) => {
    const x = `类型:${terminalType(val2.terminalType)},数量:${val2.terminalCount} `;
    return x;
  };
  const qrCodeList = (val3, index, arr) => {
    let x = `台卡名称:${val3.qrName},`;
    if (index === arr.length - 1) {
      x = `台卡名称:${val3.qrName}`;
    }
    return x;
  };
  const mlMdzdJson = (val) => {
    const x = Object.assign({
      qrCodeList: [],
      terminalList: [],
    }, val);
    return (
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>门店名称</div>
            <div className={`${s.right}`}>{x.storeName}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>POS终端</div>
            <div className={`${s.right}`}>{x.terminalList.map((val2, index) => pos(val2, index))}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>台卡付</div>
            <div className={`${s.right}`}>{x.qrCodeList.map((val3, index, arr) => qrCodeList(val3, index, arr))}</div>
          </div>
        </div>
      </div>
    );
  };
  const status = (val) => {
    let x = '';
    switch (val) {
      case '101':
        x = '草稿';
        break;
      case '112':
        x = '驳回';
        break;
      case '115':
        x = '审批中';
        break;
      case '111':
        x = '已完成';
        break;
      default:
        break;
    }
    return x;
  };
  const orderType = (val) => {
    let x = '';
    switch (val) {
      case 'add':
        x = '新增';
        break;
      case 'update':
        x = '修改';
        break;
      case 'delete':
        x = '删除';
        break;
      default:
        break;
    }
    return x;
  };
  return (
    <div>
      <div className={`${s.contentBox}`}>
        {/* <div className={`${s.contentInner}`}>
          <div className={`${s.contentList} ${s.Inner1}`}>
            <div className={`${s.left}`}>门店信息</div>
          </div>
        </div> */}
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>订单时间</div>
            <div className={`${s.right}`}>{value.applyDate}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>订单类型</div>
            <div className={`${s.right}`}>{orderType(value.orderType)}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>订单编号</div>
            <div className={`${s.right}`}>{value.orderId}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>客户名称</div>
            <div className={`${s.right}`}>{value.merchantName}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>快钱账号</div>
            <div className={`${s.right}`}>{value.billAccount}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>订单状态</div>
            <div className={`${s.right}`}>{status(value.status)}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>订单产品</div>
            <div className={`${s.right}`}>{value.product}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>最新处理时间</div>
            <div className={`${s.right}`}>{value.dealTime}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>最新处理意见</div>
            <div className={`${s.right}`}>{value.advice}</div>
          </div>
        </div>
      </div>
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList} ${s.Inner1}`}>
            <div className={`${s.left}`}>订单产品参数</div>
          </div>
        </div>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>FO产品</div>
            <div className={`${s.right}`}>&nbsp;</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>银行卡号</div>
            <div className={`${s.right}`}>{value.mlCpflJson.acountNo}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>开户名</div>
            <div className={`${s.right}`}>{value.mlCpflJson.accountName}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>开户行</div>
            <div className={`${s.right}`}>{value.mlCpflJson.bankBranch}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>CP产品</div>
            <div className={`${s.right}`}>{cpProductRate.cuRateDebit ? `借记卡:${cpProductRate.cuRateDebit}% ` : null}{cpProductRate.cuDebitMaxFee ? `封顶:${cpProductRate.cuDebitMaxFee}元 ` : null}{cpProductRate.cuRateCredit ? `贷记卡:${cpProductRate.cuRateCredit}%,` : null}{cpProductRate.maxTxnAmt ? `单笔:${cpProductRate.maxTxnAmt}元 ` : null}{cpProductRate.salesDailyQuota ? `单日:${cpProductRate.salesDailyQuota}元 ` : null}{cpProductRate.ichalfPenny === '1' ? '小额免密免签' : null}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>MP产品</div>
            <div className={`${s.right}`}>{qrCodeProductRate.weChat ? `微信:${qrCodeProductRate.weChat}% ` : null}{qrCodeProductRate.aliPay ? `支付宝:${qrCodeProductRate.aliPay}% ` : null}{value.mlCpflJson.qrCodeProductRate.cuRateDebit ? `借记卡:${qrCodeProductRate.cuRateDebit}% ` : null}{qrCodeProductRate.cuDebitMaxFee ? `封顶:${qrCodeProductRate.cuDebitMaxFee}元 ` : null}{qrCodeProductRate.cuRateCredit ? `贷记卡:${qrCodeProductRate.cuRateCredit}% ` : null}{qrCodeProductRate.unionPayDiscounts ? `银二小额优惠:${qrCodeProductRate.unionPayDiscounts}%` : null}</div>
          </div>
        </div>
      </div>
      {value.mlMdzdJson.map((val, index) => mlMdzdJson(val, index))}
    </div>
  );
};

export default Details;
