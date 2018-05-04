const driver_url = 'http://api2.wlwulian.com'
const bussiness_url = 'https://bms4cs.zhiduotong.net'

export default {
  state_prefix: '$app::',                                                    // localStorage 数据缓存前缀
  baiduAK: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',                               // baidu ak
  driver: {
    url: driver_url,                                                         // 接口处理
    api: {
      login: driver_url + '/api/Passport',                                   // 登陆
      trailer: driver_url + '/api/Trailer',                                  // 司机
      order: driver_url + '/api/Order',                                      // 运单
      orderContainer: driver_url + '/api/OrderContainer',                    // 保存订单流程
      orderContainerImage: driver_url + '/api/OrderContainerImage',          // 图片上传地址
      orderHistory: driver_url + '/api/OrderHistory',                        // 历史运单
      evaluate: driver_url + '/api/DriverEvaluate',                          // 评价
      feeCategory: driver_url + '/api/CostItem',                             // 费用种类
      fee: driver_url + '/api/OrderCost',                                    // 费用录入
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