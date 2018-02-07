import s from './Screen.less';

const Screen = (props) => {
  const _this = props.this;
  // 选中一个搜索结果
  const clickmerchant = (value) => {
    if (_this.state.navbarClick === 1) {
      const historyMerchant = _this.state.historyMerchant;
      const newHistoryMerchant = [value];
      historyMerchant.map((val) => {
        if (newHistoryMerchant.length >= 10) return null;
        if (val !== value) newHistoryMerchant.push(val);
        return null;
      });
      localStorage.setItem(_this.state.historyMerchantName, JSON.stringify(newHistoryMerchant));
      _this.setState({
        selectMerchant: value,
        navbarClick: 0,
        historyMerchant: newHistoryMerchant,
        currentPage: 1,
      }, () => _this.merchantList());
    } else {
      const historyAccount = _this.state.historyAccount;
      const newHistoryAccount = [value];
      historyAccount.map((val) => {
        if (newHistoryAccount.length >= 10) return null;
        if (val !== value) newHistoryAccount.push(val);
        return null;
      });
      localStorage.setItem(_this.state.historyAccountName, JSON.stringify(newHistoryAccount));
      _this.setState({
        selectAccount: value,
        navbarClick: 0,
        historyAccount: newHistoryAccount,
        currentPage: 1,
      }, () => _this.merchantList());
    }
  };
  const showmerchant = (value) => {
    return (
      <div className={`${s.list2}`} onClick={() => clickmerchant(value)}>{value}</div>
    );
  };
  const showHistory = (value) => {
    return (
      <div className={`${s.list}`} onClick={() => clickmerchant(value)}>{value}</div>
    );
  };
  const clearHistory = () => {
    if (_this.state.navbarClick === 1) {
      localStorage.removeItem(_this.state.historyMerchantName);
      _this.setState({
        historyMerchant: [],
      });
    } else {
      localStorage.removeItem(_this.state.historyAccountName);
      _this.setState({
        historyAccount: [],
      });
    }
  };
  const history = () => {
    return (
      <div className={`${s.contantInner}`}>
        <div className={`${s.screenHistory} row no-gutter`}>
          <div className={`${s.title} col-70`}>历史搜索</div>
          <div className={`${s.clear} col-20`} onClick={() => clearHistory()}>清空</div>
        </div>
        <div className={`${s.historyInner}`}>
          {_this.state.navbarClick === 1 ?
            _this.state.historyMerchant.map((value, index) => showHistory(value, index)) :
            _this.state.historyAccount.map((value, index) => showHistory(value, index))
          }
        </div>
      </div>
    );
  };
  const merchant = () => {
    return (
      <div className={`${s.contantInner}`}>
        <div className={`${s.historyInner}`}>
          { _this.state.showSearch.map((value, index) => showmerchant(value, index))}
        </div>
      </div>
    );
  };
  const findMerchant = () => {
    const x = !!event.target.value;
    const y = _this.state.navbarClick === 1 ? _this.state.merchant : _this.state.account;
    const z = [];
    const re = new RegExp(event.target.value);
    y.map((value) => {
      const text = value.merchantName || value.billAccount;
      if (re.test(text)) {
        z.push(text);
      }
      return null;
    });
    _this.setState({
      showHistory: !x,
      showSearch: z,
    });
  };
  const cancel = () => {
    const x = _this.state.navbarClick === 1 ?
      _this.state.selectMerchant : _this.state.selectAccount;
    if (_this.state.navbarClick === 1) {
      _this.setState({
        selectMerchant: '',
        navbarClick: 0,
        currentPage: 1,
      }, () => {
        if (x !== '') {
          _this.merchantList();
        }
      });
    } else {
      _this.setState({
        selectAccount: '',
        navbarClick: 0,
        currentPage: 1,
      }, () => {
        if (x !== '') {
          _this.merchantList();
        }
      });
    }
  };
  return (
    <div className={`${s.contantBlock}`}>
      <div className={`${s.screen}`}>
        <input
          type="text"
          className={`${s.screenInput}`}
          placeholder={_this.state.navbarClick === 1 ? '请输入商户名称' : '请输入账户名称'}
          onChange={() => findMerchant()}
          // value={_this.state.inputValue}
        />
        <div className={`${s.screenBtn}`} onClick={() => cancel()}>取消</div>
      </div>
      { _this.state.showHistory ? history() : merchant() }
    </div>
  );
};

export default Screen;
