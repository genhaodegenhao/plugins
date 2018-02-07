import moment from 'moment';
import s from './Time.less';

class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarClick: 0,
      startTime: '',
      endTime: '',
      _this: '',
      ok: false,
    };
  }

  componentDidMount() {
    const _this = this.props.this;
    moment.locale('zh-cn');
    const calendarStart = new LCalendar(); //eslint-disable-line
    const calendarEnd = new LCalendar(); //eslint-disable-line
    calendarStart.init({
      trigger: '#calendar-start',
      type: 'date',
      maxDate: _this.state.endDate,
      onChange: (e) => {
        const selectDate = _this.state.endDate === '' ? false : true; //eslint-disable-line
        _this.setState({
          startDate: e.target.value,
          selectDate,
        }, () => {
          calendarEnd.minDate(_this.state.startDate);
        });
      },
    });
    calendarEnd.init({
      trigger: '#calendar-end',
      type: 'date',
      minDate: _this.state.startDate,
      onChange: (e) => {
        const selectDate = _this.state.startDate === '' ? false : true; //eslint-disable-line
        _this.setState({
          endDate: e.target.value,
          selectDate,
        }, () => {
          calendarStart.maxDate(_this.state.endDate);
        });
      },
    });
  }

  makeSure() {
    if (!this.props.this.state.selectDate) return;
    this.props.this.setState({
      navbarClick: 0,
      currentPage: 1,
    }, () => this.props.this.orderList());
  }

  timeBack() {
    if (!this.props.this.state.selectDate) return;
    this.props.this.setState({
      navbarClick: 0,
      startDate: '', // 开始时间
      endDate: '', // 结束时间
      selectDate: false,
      currentPage: 1,
    }, () => this.props.this.orderList());
  }

  render() {
    return (
      <div className={`${s.contantBlock} ${this.props.this.state.navbarClick === 5 ? s.start : null}`}>
        <div className={`${s.title} row no-gutter`}>
          <div className={`${s.left} col-50`}>起始时间</div>
          <div className={`${s.right} col-50`} onClick={() => this.props.this.navbarClick(0)}>
            <img src={`${require('../../../assets/img/orderList/icon_delete_hdpi.png')}`} alt="delete" />
          </div>
        </div>
        <div className={`${s.center} row no-gutter`}>
          <input className={`${s.start} col-45`} type="text" placeholder="请选择时间" id="calendar-start" readOnly value={this.props.this.state.startDate} />
          <div className={`${s.middle} col-10`}>-</div>
          <input className={`${s.end} col-45`} type="text" placeholder="请选择时间" id="calendar-end" readOnly value={this.props.this.state.endDate} />
        </div>
        <div className={`${s.bottom} row no-gutter`}>
          <a href="#" className={`col-45 button active ${this.props.this.state.selectDate ? s.ok2 : null}`} onClick={() => this.timeBack()}>重置</a>
          <a href="#" className={`col-45 button active ${this.props.this.state.selectDate ? s.ok : null}`} onClick={() => this.makeSure()}>确定</a>
        </div>
      </div>
    );
  }
}

export default Time;
