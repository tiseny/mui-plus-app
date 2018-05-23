import mui from '../../../helpers/middleware';
import './login.redux';
import './login.less';

const FORWARD_URL = 'home.html';

const task = {
	login: function () {
		const $loginbtn = document.getElementById('login');
		const $account = document.getElementById('account');
		const $password = document.getElementById('password');

		$loginbtn.addEventListener('tap', function (e) {
			// 开启loading
			mui(this).button('loading');
			app.login({
				userCode: $account.value,
				password: $password.value,
				loginType: 1 // 司机端
			}).then(json => {
				mui(this).button('reset');
				if (json.result) {
					mui.openWindow({
						url: FORWARD_URL,
						id: FORWARD_URL,
						preload: true,
						show: {
							aniShow: 'pop-in'
						},
						styles: {
							popGesture: 'hide'
						},
						waiting: {
							autoShow: false
						}
					});
				} else {
					mui._toast(json.msg)
				}
			})
		})
	},

	//关闭除登录页的所有页面
	closePage: () => {
		console.log(1)
		// 获取所有Webview窗口
		let curr = plus.webview.currentWebview();
		let wvs = plus.webview.all();
		for (let i = 0, len = wvs.length; i < len; i++) {
			//关闭除当前页面外的其他页面
			if (wvs[i].getURL() == curr.getURL())
				continue;
			plus.webview.close(wvs[i]);
		}
		//打开login页面后再关闭setting页面
		plus.webview.open('../login/login.html');
		curr.close();
		console.log(curr)
		console.log(wvs)
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7'
});


// 调用h5 plus的事件系统
mui._ready(function () {

	// 登录时间
	task.login()

	// task.closePage()
});

