import s from './AccountContent.less';

const AccountContent = (props) => {
  const value = props.this.state.accountInfo;
  return (
    <div className={`${s.contentInner}`}>
      <ul>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>快钱账户</div>
          <div className={`${s.right}`}>{value.billAccount}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>Memcode</div>
          <div className={`${s.right}`}>{value.memberCode}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>银行卡号</div>
          <div className={`${s.right}`}>{value.accountNo}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>开户名</div>
          <div className={`${s.right}`}>{value.accountName}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>银行名称</div>
          <div className={`${s.right}`}>{value.bankName}</div>
        </li>
        <li className={`${s.contentList}`}>
          <div className={`${s.left}`}>开户支行</div>
          <div className={`${s.right}`}>{value.bankBranch}</div>
        </li>
      </ul>
    </div>
  );
};

export default AccountContent;
