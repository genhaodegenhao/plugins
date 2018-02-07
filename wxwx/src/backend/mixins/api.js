const baseUrl = 'https://mbp.99bill.com/mbp-merchant-gateway/coe-adscm-feign';
const baseUrl2 = 'https://mbp.99bill.com/mbp-merchant-gateway/coe-adscm-feign/coe-moss-querysrv';
// const baseUrl = 'http://192.168.14.17:8081/mbp-merchant-gateway/coe-adscm-feign';
// const baseUrl2 = 'http://192.168.14.17:8081/mbp-merchant-gateway/coe-adscm-feign/coe-moss-querysrv';
export default {
    apiUrl: {
      getUserList:`${baseUrl}/coe-moss-agentsrv/login/getUserList`,
      getUserInfo:`${baseUrl}/coe-moss-agentsrv/login/getUserInfo`,
      industryList: `${baseUrl}/coe-moss-agentsrv/mobile/industryList`,// 行业列表
      zoneList: `${baseUrl}/coe-moss-agentsrv/mobile/zoneList`, // 城市列表
      uploadFss: `${baseUrl}/coe-moss-agentsrv/mobile/entQualification/uploadFss`, // 上传
      ocrScan: `${baseUrl}/coe-moss-agentsrv/mobile/entQualification/ocrScan`, // ocr识别
      downLoadImage: `${baseUrl}/coe-moss-agentsrv/mobile/entQualification/downLoadImageByBase64`, // 下载图片
      productRateSave: `${baseUrl}/coe-moss-agentsrv/mobile/productRateSave`, // 产品费率保存(token)
      companyCertifiSave: `${baseUrl}/coe-moss-agentsrv/mobile/companyCertifiSave`, // 企业证件信息(token)
      creditSupplSave: `${baseUrl}/coe-moss-agentsrv/mobile/creditSupplSave`, //征信信息(token)
      queryRateList: `${baseUrl}/coe-moss-querysrv/mobile/queryRateList`, //获取默认费率信息
      storeTerminalSave: `${baseUrl}/coe-moss-agentsrv/mobile/storeTerminalSave`, //门店信息(token)
      storeDelete: `${baseUrl}/coe-moss-agentsrv/mobile/storeDelete`, // 门店删除(token)
      applyPageInfo: `${baseUrl}/coe-moss-agentsrv/mobile/applyPageInfo`, // 页面查询
      applyPageInfo: `${baseUrl}/coe-moss-agentsrv/mobile/applyPageInfo`, // 页面查询
      bankCardBinCheck: `${baseUrl}/coe-moss-querysrv/mobile/BankCardBinCheck`, //银行卡bin校验
      queryMaInfo: `${baseUrl}/coe-moss-querysrv/mobile/queryMaInfo`, // 二维码扫描
      subBankInfoList: `${baseUrl}/coe-moss-querysrv/mobile/SubBankInfoList`, // 支行信息
      queryLegalAndCompany: `${baseUrl}/coe-moss-agentsrv/mobile/queryLegalAndCompany`, // 获取法人与公司名称
      applySubmit: `${baseUrl}/coe-moss-agentsrv/mobile/applySubmit`, // 提交审核
      pageInfoIsFull: `${baseUrl}/coe-moss-agentsrv/mobile/pageInfoIsFull`, // 确定
      enterpriseCredit: `${baseUrl}/coe-moss-agentsrv/mobile/enterpriseCredit`, // 征信信息回填
    }
};

export {baseUrl2};