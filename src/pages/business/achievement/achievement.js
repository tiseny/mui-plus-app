import mui from '../../../helpers/middleware';
import { goLogin, pageBack } from '../../../helpers/util';
import './achievement.redux';
import './achievement.less'

const DETAIL_URL = 'myDetail.html'

const task = {
	// 退出登录
	quit: () => {
		const $quitBtn = document.getElementById('quit')
		$quitBtn.addEventListener('tap', function (e) {
			mui(this).button('loading');
			app.my.quit().then(json => {
				mui(this).button('reset');
				if (json.result) {
					goLogin(mui)
				}
			})
		})
	},
	//点击标签获取标签id跳转到相关页面并传参
	listenForward: () => {
		mui('.mui-table-view').on('tap', '.mui-table-view-cell', function () {
			const id = this.getAttribute('data-id')
			const title = this.childNodes[0].innerText
			mui.openWindow({
				url: `${DETAIL_URL}?part_id=${id}&part_title=${title}`,
				id: DETAIL_URL,
				extras: {
					part_id: id,
					part_title: title
				}
			});
		})
	}
}

// 调用h5 plus的事件系统
mui._ready(function () {

	task.listenForward()

	task.quit()

	pageBack(mui)
});