import s from './StateType.less';

const StateType = (props) => {
  const _this = props.this;
  const clickType = (value) => {
    if (_this.state.navbarClick === 3) {
      if (_this.state.selectState !== value) {
        _this.setState({
          selectState: value,
          navbarClick: 0,
          currentPage: 1,
        }, () => _this.orderList());
      } else {
        _this.setState({
          navbarClick: 0,
        });
      }
    } else if (_this.state.selectType !== value) {
      _this.setState({
        selectType: value,
        navbarClick: 0,
        currentPage: 1,
      }, () => _this.orderList());
    } else {
      _this.setState({
        navbarClick: 0,
      });
    }
  };
  const showContantInner = () => {
    if (_this.state.navbarClick === 3) {
      return (
        <div>
          <div className={`${s.contantInner}`} onClick={() => clickType('')}>全部</div>
          { _this.state.selectMerchant !== '' || _this.state.selectAccount !== '' || _this.state.selectType !== '' ? null : <div className={`${s.contantInner}`} onClick={() => clickType('草稿')}>草稿</div>}
          <div className={`${s.contantInner}`} onClick={() => clickType('驳回')}>驳回</div>
          <div className={`${s.contantInner}`} onClick={() => clickType('审批中')}>审批中</div>
          <div className={`${s.contantInner}`} onClick={() => clickType('已完成')}>已完成</div>
        </div>
      );
    }
    return (
      <div>
        <div className={`${s.contantInner}`} onClick={() => clickType('')}>全部</div>
        <div className={`${s.contantInner}`} onClick={() => clickType('新增')}>新增</div>
        <div className={`${s.contantInner}`} onClick={() => clickType('变更')}>变更</div>
        <div className={`${s.contantInner}`} onClick={() => clickType('撤销')}>撤销</div>
      </div>
    );
  };
  return (
    <div className={`${s.contantBlock} ${_this.state.navbarClick === 3 || _this.state.navbarClick === 4 ? s.start : null}`}>
      {showContantInner()}
    </div>
  );
};

export default StateType;
