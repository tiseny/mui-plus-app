import mui from '../../../helpers/middleware';
import { pageBack } from '../../../helpers/util';
import { setState, getState } from '../../../helpers/state';
import './fee.redux';
import './fee.less';

const DETAIL_URL = 'orderDetail.html'
const FEEDETAIL_URL = 'feeDetail.html'

const template = require('../../../libs/art.template');
let searchMonth = new Date().getMonth() + 1;
const task = {

	listenSearch: () => {
		document.getElementById("search").addEventListener('input', function () {
			if (this.value == '') {
				task.fetchFee()
			} else {
				task.fetchFee({ queries: this.value });
			}
		})
	},
	listenForward: () => {
		mui('#fee-mui-scroll').on('tap', '.orderRow', function () {
			const id = this.getAttribute('data-id')
			mui.openWindow({
				url: `${DETAIL_URL}?order_id=${id}`,
				id: DETAIL_URL,
				extras: {
					order_id: id
				}
			});
		})
	},

	listenFee: () => {
		mui('#fee-mui-scroll').on('tap', '.feeRow', function () {
			const id = this.getAttribute('data-id')
			const OrderStatus = this.getAttribute('data-OrderStatus')
			mui.openWindow({
				url: `${FEEDETAIL_URL}?order_id=${id}`,
				id: FEEDETAIL_URL,
				extras: {
					order_id: id
				}
			});
		})
	},

	fetchFee: (value) => {
		if (!value || value.month == undefined) {
			document.getElementById('month').innerHTML = '全部对账单'
		} else {
			document.getElementById('month').innerHTML = searchMonth + '月份对账单'
		}
		app.fee.checkSheet({
			value
		}).then(json => {
			//费用总金额
			let total = 0;
			for (let i in json.data) {
				total += json.data[i].Amount
			}
			const html = template('fee-template', {
				data: json.data
			});
			document.getElementById('fee-mui-scroll').innerHTML = html;
			document.getElementById('total').innerHTML = Number(total).formatMoney()
		})
	},

	//月份选择
	listenChoose: () => {
		mui('body').on('tap', '.action-btn', () => {
			mui('#fee-choose').popover('toggle');
		})
	},

	//根据月份查询数据
	listenMonth: () => {
		mui('body').on('tap', '.mui-table-view-cell', function () {
			mui('#fee-choose').popover('toggle');
			//获取现在月份，每切换一次月份存储一次
			let nowMonth = new Date().getMonth() + 1;

			if (this.dataset.id == 'now') {
				task.fetchFee({ month: nowMonth })
				searchMonth = nowMonth
			} else if (this.dataset.id == 'all') {
				task.fetchFee()
				searchMonth = nowMonth
				return
			} else {
				//现在等于存储月份
				if (searchMonth > nowMonth) {
					if (this.dataset.id == 'last') {
						searchMonth = nowMonth
					} else if (this.dataset.id == 'next') {
						searchMonth = 1
					}
				} else {		//now>search
					if (this.dataset.id == 'last') {
						if (searchMonth <= 1) {
							searchMonth = nowMonth
						} else {
							searchMonth--
						}
					} else if (this.dataset.id == 'next') {
						if (searchMonth >= nowMonth) {
							searchMonth = 1
						} else {
							searchMonth++
						}
					}
				}
			}
			task.fetchFee({ month: searchMonth })
		})
	}
}




// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7',
	swipeBack: false
});


// 调用h5 plus的事件系统
mui._ready(function () {

	task.fetchFee()

	task.listenForward()

	task.listenFee()

	task.listenSearch()

	task.listenChoose()

	task.listenMonth()

	pageBack(mui)
	
});


