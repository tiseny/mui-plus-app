const url = 'https://wlTestApi.wlwulian.com'

export default {
  state_prefix: '$app::',                                             // localStorage 数据缓存前缀
  baiduAK: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',                        // baidu ak
  driver: {                                                           // 接口处理
    api: {
      login: url + '/api/Passport',                                   // 登陆
      orderTruck: url + '/api/OrderTruck/GetByType',                  // 已接待接数据
      orderHistory: url + '/api/OrderTruck/GetOrderHistory',          // 历史运单分页
      orderDetail: url + '/api/OrderTruck',                           // 运单详情
      fee: url + '/api/OrderCost',                                    // 查看费用
      feeDetail: url + '/api/OrderCost/GetByPartnerBillId',           // 查看出了对账单费用
      feeCategory: url + '/api/CostItem',                             // 费用类目
      trailer: url + '/api/Trailer',                                  // 司机资料
      orderContainer: url + '/api/OrderContainer',                    // 货柜信息
      orderContainerImage: url + '/api/OrderContainerImage',          // 货柜信息环节图片上传
      checkSheet: url + '/api/DriverBillDetail',                      // 对账单
      feeDefault: url + '/api/CostItem/GetDefault',                   // 获取司机端的默认费用
      loan: url + '/api/DriverRequest',                               // 借款列表与添加
      oil: url + '/api/Refuelling',                                   // 打油列表
      DriverLocation: url + '/api/Location',                          // 上传位置信息
    }
  },
  business: {
    api: {
      login: url + '/api/Passport',
      chat: url + '/api/WxInfoBox',
      order: url + '/api/WxOrderEasy',
      orderTotal: url + '/api/GetOrderEasySummary',
      orderTypes: url + '/api/GetOrderType',
      customerStore: url + '/api/GetCustomerStore',
      supplierStore: url + '/api/GetSupplierStore',
      imageUpload: url + '/api/WxOrderAttachment',
      repayList: url + '/api/WxPaymentRequest',  
    }
  }
}