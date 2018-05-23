import mui from '../../../helpers/middleware';
import { pageBack, getQuery } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import $ from 'jquery';
import './order.redux';
import './order.less';


const template = require('../../../libs/art.template');

const task = {

	state: {
		activeIndex: 0,   // 切换的tab项目
		pageIndex: 1,			// 当前页面
		pageSize: 5,			// 分页大小
		total: 0,					// 总条数
		list: [],
		loaded: false,    // 是否加载完毕
		angle: 0,					//按钮角度
	},

	//刷新按钮
	bindRefresh: () => {
		mui('body').on('tap', '#refresh-btn', function () {
			task.state.angle += 360
			$('#refresh-btn').css({
				'transform': 'rotate(' + task.state.angle + 'deg)',
				'-webkit-transform': 'rotate(' + task.state.angle + 'deg)',
				'transition': 'transform 1s',
				'-webkit-transition': '-webkit-transform 1s',
			})
			task.state.list = []
			task.state.pageIndex = 1
			task.fetchList(task.state.activeIndex)
		})
	},

	switchTab: () => {
		$('#slider').on('tap', '.item', function (e) {
			// 切换到第几个
			const index = $(this).index()
			// 效果
			$(this).addClass('active').siblings().removeClass('active');
			$('#slider').find('.slider-body .item-wrap').eq(index).show().siblings('.item-wrap').hide();
			// 存储 
			task.state.activeIndex = index
			// 请求列表数据
			task.fetchList(index)

			if (index < 2) {
				$('#more').hide()
			} else {
				task.state.pageIndex = 1			// 当前页面
				$('#more').show()
			}
		})
	},

	reachBottom: () => {
		window.onscroll = function () {
			// 如果是历史订单
			if (task.state.activeIndex == 2) {
				// 窗口高度
				const wh = $(window).height()
				// 内容高度
				const contentH = $('#slider').find('.item-wrap').eq(2).height()
				// 当前的滚动高度 
				const scrollH = $(window).scrollTop()
				// 如果间距小于 100 的时候，继续请求
				if (contentH - wh - scrollH < 100) {
					// 如果还没有加载完毕
					if (task.state.pageIndex < Math.ceil(task.state.total / task.state.pageSize)) {
						++task.state.pageIndex

						task.fetchList(2)
					} else {
						// 必须大于 1页
						task.state.loaded = task.state.total / task.state.pageSize > 1
						$('#more').html(template('more-template', {
							loaded: task.state.loaded
						}))
					}
				}
			}
		}
	},

	fetchList: (index) => {
		mui.os.plus && plus.nativeUI.showWaiting('加载中...');

		const apiList = ['fetchWaitList', 'fetchRecieveList', 'fetchHistoryList']
		const templateList = ['wait-template', 'recieve-template', 'history-template']
		// 请求参数
		let params = { type: "WAITING" }
		// 已接运单
		if (index == 1) {
			params = { type: 'RECEIVED' }
		} else if (index == 2) {
			params = {
				pageIndex: task.state.pageIndex,
				pageSize: 5
			}
		}

		app.order[apiList[index]](params).then(json => {
			mui.os.plus && plus.nativeUI.closeWaiting();
			if (json.result) {
				if (index > 1) {
					task.state.total = json.data.RecordCount * 1,
						task.state.list = task.state.pageIndex == 1 ? json.data.Data : task.state.list.concat(json.data.Data)
				} else {
					task.state.list = json.data
				}

				$('#slider .slider-body').find('.item-wrap').eq(index).html(template(templateList[index], {
					list: task.state.list
				}))
			}
		})
	},

	initPage: () => {
		let activeIndex = getQuery(mui, 'activeIndex')
		// 如果有参数
		activeIndex = activeIndex != null ? activeIndex : 0
		// 赋值给 task.state.activeIndex
		task.state.activeIndex = activeIndex

		task.fetchList(activeIndex)

		$('#slider .slider-header').find('.item').eq(activeIndex).removeClass('active').addClass('active').siblings().removeClass('active')
	},

	listenForward: () => {
		const urlAsrs = ['waitOrderDetail.html', 'recieveOrderDetail.html', 'orderDetail.html']
		mui('.item-wrap').on('tap', '.orderRow', function () {
			const id = this.getAttribute('data-id')
			const url = urlAsrs[task.state.activeIndex]
			mui.openWindow({
				url: `${url}?order_id=${id}`,
				id: url,
				extras: {
					order_id: id
				}
			});
		})
	},

	listenFee: () => {
		mui('.item-wrap').on('tap', '.history-bottom', function () {
			const id = this.getAttribute('data-id')
			const OrderStatus = this.getAttribute('data-OrderStatus')
			const OrderNo = this.getAttribute('data-OrderNo')
			mui.openWindow({
				url: `feeDetail.html?order_id=${id}&OrderStatus=${OrderStatus}&order_no=${OrderNo}`,
				id: 'feeDetail.html',
				extras: {
					order_id: id,
					OrderStatus: OrderStatus,
					order_no: OrderNo
				}
			});
		})
	},

}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: false,
	/*pullRefresh : {
    container:"#recieve-page",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
    down : {
    	height:50,//可选,默认50.触发下拉刷新拖动距离,
      auto: false,//可选,默认false.首次加载自动下拉刷新一次
      contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
      contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
      contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
      callback : task.fetchRecieveList //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    }
  }*/
});


// 调用h5 plus的事件系统
mui._ready(function () {

	task.listenFee()

	task.listenForward()

	task.reachBottom()

	task.switchTab()

	task.initPage()

	task.bindRefresh()

	pageBack(mui)

});


