import s from './MerchantContent.less';

const MerchantContent = (props) => {
  const value = props.this.state.merchantInfo;
  const cardType = (val) => {
    let x = '';
    switch (val) {
      case '1':
        x = '居民身份证';
        break;
      case '2':
        x = '港澳通行证';
        break;
      case '3':
        x = '台胞证';
        break;
      case '4':
        x = '外籍护照';
        break;
      case '9':
        x = '其他';
        break;
      default:
        break;
    }
    return x;
  };
  const businessType = (val) => {
    let x = '';
    switch (val) {
      case '0':
        x = '营业执照';
        break;
      case '1':
        x = '非营业执照';
        break;
      default:
        break;
    }
    return x;
  };
  return (
    <div className={`${s.contentInner}`}>
      <ul>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>客户名称</div>
          <div className={`${s.right}`}>{value.merchantName}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>快钱账户</div>
          <div className={`${s.right}`}>{value.billAccount}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>企业类型</div>
          <div className={`${s.right}`}>{value.companyType}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>证件类型</div>
          <div className={`${s.right}`}>{businessType(value.businessType)}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>证件号码</div>
          <div className={`${s.right}`}>{value.businessRegno}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>约定业务</div>
          <div className={`${s.right}`}>{value.constraintBusiness}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>注册地址</div>
          <div className={`${s.right}`}>{value.registAddress}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>法人姓名</div>
          <div className={`${s.right}`}>{value.legalName}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>法人证件</div>
          <div className={`${s.right}`}>{cardType(value.cardType)}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>证件号码</div>
          <div className={`${s.right}`}>{value.legalId}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>移动电话</div>
          <div className={`${s.right}`}>{value.mobilePhone}</div>
        </li>
      </ul>
    </div>
  );
};

export default MerchantContent;
