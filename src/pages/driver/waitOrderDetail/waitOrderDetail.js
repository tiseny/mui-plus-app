import mui from '../../../helpers/middleware';
import { pageBack, getQuery, callPhone, openMap } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './waitOrderDetail.redux';
import './waitOrderDetail.less';

const template = require('../../../libs/art.template');
let ids = []

const task = {

	listenMobile: () => {
		mui('body').on('tap', '.sys-mobile', function () {
			const mobile = this.getAttribute('data-mobile')
			callPhone(mobile);
		})
	},

	listenAddress: () => {
		mui('body').on('tap', '.sys-address', function () {
			const address = this.getAttribute('data-address')
			openMap(address)
		})
	},

	acceptOrder: () => {
		mui('body').on('tap', '.mui-btn', function () {
			const accept = this.getAttribute('data-accept')
			const confirm_title = accept == true ? '接单提醒' : '拒单提醒'
			const confirm_content = accept == true ? '确定要接取订单？' : '拒接订单后，需要等待一定的时间直到下次订单的派发！'

			mui.confirm(confirm_content, confirm_title, ['确认', '取消'], e => {
				if (e.index == 0) {
					// 开启loading
					mui(this).button('loading');
					app.waitOrderDetail.acceptOrder({
						ids,
						accept
					}).then(json => {
						mui(this).button('reset');
						if (json.result) {
							mui._toast(accept == true ? '接单成功' : '拒单成功')
							setTimeout(() => {
								mui.openWindow({
									url: `order.html?activeIndex=1`,
									id: 'order.html',
									extras: {
										activeIndex: 1
									}
								});
							}, 1500)
						}else{
							mui._toast(json.msg)
						}
					})
				}
			})
		})
	},

	// 获取 待解运单数据
	fetchDetail: () => {
		mui.os.plus && plus.nativeUI.showWaiting('加载中...');
		app.waitOrderDetail.fetchDetail({
			id: getQuery(mui, 'order_id')
		}).then(json => {
			if (json.result) {
				ids = json.data ? [json.data].map(item => item.Id) : []
			}
			mui.os.plus && plus.nativeUI.closeWaiting();
			//mui('#waitOrderDetail-page').pullRefresh().endPulldownToRefresh(); 
			const html = template('waitOrderDetail-template', { data: json.data });
			document.getElementById('waitOrderDetail-page').innerHTML = html;
		})
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: true,
	/*pullRefresh : {
    container:"#waitOrderDetail-page",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down : {
    	height:50,//可选,默认50.触发下拉刷新拖动距离,
      auto: false,//可选,默认false.首次加载自动下拉刷新一次
      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
      callback : task.fetchDetail //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }
  }*/
});


// 调用h5 plus的事件系统
mui._ready(function () {

	task.fetchDetail()

	task.listenMobile()

	task.listenAddress()

	task.acceptOrder()

});
