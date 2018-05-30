import mui from '../../../helpers/middleware';
import { setState, getState, clearState } from '../../../helpers/state';
import { goLogin, pageBack } from '../../../helpers/util';
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
			if (navigator.userAgent.indexOf('Windows') === -1) {
				plus.nativeUI.showWaiting("登录中...");
				if ($account.value == '' || $password.value == '') {
					mui._toast('登录名或密码不可为空')
					mui(this).button('reset');
					plus.nativeUI.closeWaiting();
					return
				}
			}
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
					mui(this).button('reset');
					$('#login-form').hide()
					plus.nativeUI.closeWaiting();
				} else {
					mui._toast(json.msg)
					mui(this).button('reset');
					plus.nativeUI.closeWaiting();
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
		//如果密码存储时间大于7天 重新登录
		if ((Date.now() - (getState('rememberDate') * 1)) / 1000 / 60 / 60 / 24 < 7 && getState('token')) {
			$('#login-form').hide()
			plus.nativeUI.showWaiting("登录中...");
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
				plus.nativeUI.closeWaiting();
			}, 1000)
		} else {
			$('#login-form').show()
			clearState('rememberDate')
			clearState('token')
		}
	}
}

// ios 导航状态
mui.init({
	statusBarBackground: '#f7f7f7'
});


// 调用h5 plus的事件系统
mui._ready(function () {

	pageBack(mui)
	
	// 登录时间
	task.login()

	task.isLocalLogin()

	task.rememberPass()

});

