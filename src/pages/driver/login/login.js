import mui from '../../../helpers/middleware';
import { setState, getState, clearState } from '../../../helpers/state';
import './login.redux';
import './login.less';
import $ from 'jquery';

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
					mui(this).button('reset');
				}
			})
		})
	},

	//记住密码按钮状态
	checkedState: () => {
		if (!$("#rememberBox").prop("checked")) {
			setState('rememberDate', Date.now())
		} else {
			clearState('rememberDate')
		}
	},

	//记住密码
	rememberPass: () => {
		mui('body').on('tap', '#remember', function () {
			task.checkedState()
		})
	},

	//进入页面判断是否有本地登录信息
	isLocalLogin: () => {
		let loginState = ''
		//如果密码存储时间大于7天 重新登录
		if ((Date.now() - (getState('rememberDate') * 1)) / 1000 / 60 / 60 / 24 < 7 && getState('token')) {
			if (plus) {
				plus.nativeUI.showWaiting({
					title: "登录中...",
					options: {
						background: '#eff2f5',
						color: '#999'
					}
				});
			}
			setTimeout(() => {
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
			}, 1000)
		} else {
			loginState = "notLogin"
			clearState('rememberDate')
			clearState('token')
		}
		if (loginState === 'isLogin') {
			$('#login-form').hide()
		}
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

	task.isLocalLogin()

	task.rememberPass()

});

