import moment from 'moment';
import s from './Time.less';

class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navbarClick: 0,
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
          if (_this.state.selectDate) {
            _this.setState({
              navbarClick: 0,
              currentPage: 1,
            }, () => {
              _this.merchantList();
            });
          }
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
          if (_this.state.selectDate) {
            _this.setState({
              navbarClick: 0,
              currentPage: 1,
            }, () => {
              _this.merchantList();
            });
          }
        });
      },
    });
  }

  makeSure() {
    if (!this.props.this.state.selectDate) return;
    this.props.this.setState({
      navbarClick: 0,
      currentPage: 1,
    }, () => this.props.this.merchantList());
  }

  render() {
    return (
      <div className={`${s.contantBlock}`}>
        <div className={`${s.center} row no-gutter`}>
          <div className={`${s.title} col-20`}>开始时间</div>
          <input className={`${s.input} col-80`} type="text" placeholder="请选择开始时间" id="calendar-start" readOnly value={this.props.this.state.startDate} />
        </div>
        <div className={`${s.center} row no-gutter`}>
          <div className={`${s.title} col-20`}>结束时间</div>
          <input className={`${s.input} col-80`} type="text" placeholder="请选择结束时间" id="calendar-end" readOnly value={this.props.this.state.endDate} />
        </div>
      </div>
    );
  }
}

export default Time;

/*
  <input className={`${s.start} col-45`} type="text" placeholder="请选择时间" id="calendar-start" />
*/
