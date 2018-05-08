const driver_url = 'https://wlTestApi.wlwulian.com'
const bussiness_url = 'https://bms4cs.zhiduotong.net'

export default {
  state_prefix: '$app::',                                                    // localStorage 数据缓存前缀
  baiduAK: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',                               // baidu ak
  driver: {
    url: driver_url,                                                         // 接口处理
    api: {
      login: driver_url + '/api/Passport',                                   // 登陆
      orderTruck: driver_url + '/api/OrderTruck/GetByType',                  // 已接待接数据
      orderHistory: driver_url + '/api/OrderTruck/GetOrderHistory',          // 历史运单分页
      orderDetail: driver_url + '/api/OrderTruck',                           // 运单详情
      fee: driver_url + '/api/OrderCost',                                    // 查看费用
      feeCategory: driver_url + '/api/CostItem',                             // 费用类目
      trailer: driver_url + '/api/Trailer',                                  // 司机资料
      orderContainer: driver_url + '/api/OrderContainer',                    // 货柜信息
      orderContainerImage: driver_url + '/api/OrderContainerImage',          // 货柜信息环节图片上传
      checkSheet: driver_url + '/api/DriverCheckSheet'                       // 对账单
    }
  },
  bussiness: {
    url: bussiness_url,                                                      // 接口处理
    api: {
      login: bussiness_url + '/api/WxPassport',
      chat: bussiness_url + '/api/WxInfoBox',
      order: bussiness_url + '/api/WxOrderEasy',
      orderTotal: bussiness_url + '/api/GetOrderEasySummary',
      orderTypes: bussiness_url + '/api/GetOrderType',
      customerStore: bussiness_url + '/api/GetCustomerStore',
      supplierStore: bussiness_url + '/api/GetSupplierStore',
      imageUpload: bussiness_url + '/api/WxOrderAttachment',
      repayList: bussiness_url + '/api/WxPaymentRequest',  
    }
  }
}