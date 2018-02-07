// import { asyncComponent } from '../utils/asyncComponent';
import OrderList from '../components/containers/orderList/OrderList';
import MerchantList from '../components/containers/merchantList/MerchantList';
import StaticCode from '../components/containers/staticCode/StaticCode';
import ShowCode from '../components/containers/staticCode/ShowCode';
import Message from '../components/containers/message/Message';
import EnterpriseIndex from '../components/containers/enterprise-index/enterprise-index';
import EnterpriseInf from '../components/containers/enterprise-inf/enterprise-inf';
import ProductRateInf from '../components/containers/product-rate-inf/product-rate-inf';
import StoreTerminal from '../components/containers/store-terminal/store-terminal';
import CreditInf from '../components/containers/credit-inf/credit-inf';
import BankList from '../components/containers/bank-list/bank-list';
import MessageDetails from '../components/containers/messageDetails/MessageDetails';
import BeforeLogin from '../components/containers/login/BeforeLogin';
import Login from '../components/containers/login/Login';
import ForgetPassword from '../components/containers/login/ForgetPassword';
import Index from '../components/containers/index/Index';
import Merchant from '../components/containers/merchant/Merchant';
import Oreder from '../components/containers/order/Order';

// const Index = asyncComponent(() => import('../components/containers/index/Index'));
// const OrderList = asyncComponent(() => import('../components/containers/orderList/List'));

const router = {
  'p/beforeLogin.html': {
    mod: BeforeLogin,
    title: '登录',
  },
  'p/login.html': {
    mod: Login,
    title: '登录',
  },
  'p/forgetPassword.html': {
    mod: ForgetPassword,
    title: '忘记密码',
  },
  'p/index.html': {
    mod: Index,
    title: '商务拓展系统',
  },
  'p/merchant.html': {
    mod: Merchant,
    title: '商户详情',
  },
  'p/orderList.html': {
    mod: OrderList,
    title: '我的订单',
  },
  'p/merchantList.html': {
    mod: MerchantList,
    title: '我的商户',
  },
  'p/staticCode.html': {
    mod: StaticCode,
    title: '静态码列表',
  },
  'p/showCode.html': {
    mod: ShowCode,
    title: '静态码',
  },
  'p/message.html': {
    mod: Message,
    title: '通知',
  },
  'p/enterprise-index.html': {
    mod: EnterpriseIndex,
    title: '企业商户进件',
  },
  'p/enterprise-inf.html': {
    mod: EnterpriseInf,
    title: '企业证件信息',
  },
  'p/product-rate-inf.html': {
    mod: ProductRateInf,
    title: '结算账户及产品费率',
  },
  'p/store-terminal.html': {
    mod: StoreTerminal,
    title: '门店终端信息',
  },
  'p/credit-inf.html': {
    mod: CreditInf,
    title: '证信信息补充',
  },
  'p/bank-list.html': {
    mod: BankList,
    title: '选择银行',
  },
  'p/messageDetails.html': {
    mod: MessageDetails,
    title: '通知详情',
  },
  'p/order.html': {
    mod: Oreder,
    title: '订单详情',
  },
};

export default router;
