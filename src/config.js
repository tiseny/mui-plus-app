const driver_url = 'https://wlTestApi.wlwulian.com'
const bussiness_url = 'https://wlTestApi.wlwulian.com'  // https://bms4cs.zhiduotong.net

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
      feeDetail: driver_url + '/api/OrderCost/GetByPartnerBillId',           // 查看出了对账单费用
      feeCategory: driver_url + '/api/CostItem',                             // 费用类目
      trailer: driver_url + '/api/Trailer',                                  // 司机资料
      orderContainer: driver_url + '/api/OrderContainer',                    // 货柜信息
      orderContainerImage: driver_url + '/api/OrderContainerImage',          // 货柜信息环节图片上传
      checkSheet: driver_url + '/api/DriverBillDetail',                      // 对账单
      feeDefault: driver_url + '/api/CostItem/GetDefault',                   // 获取司机端的默认费用
      loan: driver_url + '/api/DriverRequest',                               // 借款列表与添加
      oil: driver_url + '/api/Refuelling',                                   // 打油列表
      DriverLocation: driver_url + '/api/Location',                          //上传位置信息
    }
  },
  business: {
    url: bussiness_url,                                                      // 接口处理
    api: {
      login: bussiness_url + '/api/Passport',
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