import s from './ApprovalLog.less';

const ApprovalLog = (props) => {
  const value = props.this.state.data.approveLogList || [];
  const renderList = (val) => {
    return (
      <div className={`${s.contentBox}`}>
        <div className={`${s.contentInner}`}>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>审批时间</div>
            <div className={`${s.right}`}>{val.approveTime}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>审批人</div>
            <div className={`${s.right}`}>{val.approveUser}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>审批意见</div>
            <div className={`${s.right}`}>{val.comments}</div>
          </div>
          <div className={`${s.contentList}`}>
            <div className={`${s.left}`}>审批节点</div>
            <div className={`${s.right}`}>{val.nodeName}</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {value.map((val, index) => renderList(val, index))}
    </div>
  );
};

export default ApprovalLog;
