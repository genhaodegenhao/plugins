import React from 'react';
import bankLists from '../../../utils/bankList.js';
import s from './bank-list.less';

class bankList extends React.Component {
  /**
   * 导航滚动
   */
  /* eslint-disable */
  static addNavClickHandler() {
    setTimeout(function() {
      const letterNavDom = document.querySelector('.letter-nav')
      const liHeight = document.querySelector('.bank-list li').offsetHeight;
      const bankList = document.querySelector('.bank-list');
      letterNavDom.addEventListener('click', function (e) {
          const letter = e.target.innerHTML;
          if(window.rowStartOfLetters[letter]) {
            console.log(rowStartOfLetters[letter]);;
            bankList.scrollTop = (rowStartOfLetters[letter] - 1) * liHeight;
            console.log(bankList.scrollTop);
          }
      })
    }, 100);
  }

  constructor(props) {
    super(props);
    this.state = {
      _this: null, // 上页面传值
      bankListAll: bankLists.bank.bankList, //银行总数据
      bankList: bankLists.bank.bankList, // 银行数据
    };
    this.bankSelected = this.bankSelected.bind(this);
    this.inputBank = this.inputBank.bind(this);
  }

  componentDidMount() {
    const _this = this;
    window.app.onPageInit('p/bank-list.html', (page) => {
      if (page.query && page.query.this) { // 有查询参数
        _this.setState({ _this: page.query.this });
      }
    });
    bankList.addNavClickHandler();
  }

  /**
   *  银行搜素
   */
  inputBank(e) {
    const val = e.target.value;
    let bankList = [];
    this.state.bankListAll.map((item,index) => {
      if (item.name.indexOf(val,0) != -1) {
        bankList.push(item);
      }
    });
    this.setState( {bankList: bankList} );
  }
  
  /**
   * 银行选择
   */
  bankSelected(e) {
    const val = $$(e.target).closest('li').attr('data-val');
    this.state._this.setState({ 
      bankName: val 
    }, () => {
      window.app.mainView.router.back({
        url: 'p/product-rate-inf.html',
        animatePages: true,
      });
    });
  }

  render() {
    let bankItem = null;
    window.rowStartOfLetters = {};
    let currentRow = 0;
    bankItem=this.state.bankList.map((item, index) => {
      currentRow ++;
      if (window.rowStartOfLetters[item.letter] == undefined) {
        window.rowStartOfLetters[item.letter] = currentRow;
      }
      return (
        <li letter={item.letter} data-val={item.name} onClick={this.bankSelected}>
          <img src={item.imgUrl} />
          <span>{item.name}</span>
        </li>
      )
    });
    return (
      <div className={`page-bank ${s.pageBank}`}>
        <div className={s.searchWrapper}>
          <input className={s.search} type="text" placeholder="搜索" onChange={this.inputBank} />
        </div>
        <div className={`${s.bankSlider} bank-slider`}>
          <div className={s.hot}>提示：商户银行账户为各城市商业银行的，请选择>城市商业银行;为各农村商业银行的，请选择>农村商业银行</div>
          <ul className={`${s.bankList} bank-list`}>
            {
              bankItem
            }
          </ul>
          <ul className={`letter-nav ${s.letterNav}`}>
              <li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>P</li><li>Q</li><li>R</li><li>S</li>
              <li>T</li><li>W</li><li>X</li><li>Y</li><li>Z</li>
          </ul>
        </div>
    </div>
    );
  }
}

export default bankList;
