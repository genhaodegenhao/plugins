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
        }, () => _this.merchantList());
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
      }, () => _this.merchantList());
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
          <div className={`${s.contantInner}`} onClick={() => clickType('草稿')}>草稿</div>
          <div className={`${s.contantInner}`} onClick={() => clickType('驳回')}>驳回</div>
          <div className={`${s.contantInner}`} onClick={() => clickType('审批中')}>审批中</div>
          <div className={`${s.contantInner}`} onClick={() => clickType('开通中')}>开通中</div>
          <div className={`${s.contantInner}`} onClick={() => clickType('已完成')}>已完成</div>
        </div>
      );
    }
    return (
      <div>
        <div className={`${s.contantInner}`} onClick={() => clickType('')}>全部</div>
        <div className={`${s.contantInner}`} onClick={() => clickType('个人')}>个人</div>
        <div className={`${s.contantInner}`} onClick={() => clickType('个体户')}>个体户</div>
        <div className={`${s.contantInner}`} onClick={() => clickType('企业')}>企业</div>
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
