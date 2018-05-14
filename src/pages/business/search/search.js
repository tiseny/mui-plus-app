import mui from '../../../helpers/middleware';
import { goLogin, pageBack } from '../../../helpers/util';
import './search.redux';
import './search.less'

const DETAIL_URL = 'searchDetail.html'

const task = {
	search: () => {
		mui('body').on('tap', '#search', function() {

			const start = "福田区"
			const end = "南山区"

			mui.openWindow({
				url: `${DETAIL_URL}?start=${start}&end=${end}`,
				id: DETAIL_URL,
				extras: {
					start,
					end
				}
			});
		})
	}
}

// 调用h5 plus的事件系统
mui._ready(function () {

	task.search()

	pageBack(mui)
});