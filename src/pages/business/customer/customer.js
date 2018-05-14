import mui from '../../../helpers/middleware';
import { goLogin, pageBack } from '../../../helpers/util';
import './customer.redux';
import './customer.less'

const DETAIL_URL = 'customerDetail.html'

const task = {
	//点击标签获取标签id跳转到相关页面并传参
	listenForward: () => {
		mui('.mui-table-view').on('tap', '.mui-table-view-cell', function () {
			const id = this.getAttribute('data-id')
			mui.openWindow({
				url: `${DETAIL_URL}?id=${id}`,
				id: DETAIL_URL,
				extras: {
					id: id
				}
			});
		})
	},

	addCustomer: () => {
		mui('body').on('tap', '#add', function() {
			mui.openWindow({
				url: DETAIL_URL,
				id: DETAIL_URL
			});
		}) 
	}
}

// 调用h5 plus的事件系统
mui._ready(function () {

	task.listenForward()

	task.addCustomer()

	pageBack(mui)
});