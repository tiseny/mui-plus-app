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

			if ($account.value == '' || $password.value == '') {
				mui._toast('登录名或密码不可为空')
				mui(this).button('reset');
				return
			}

			const params = {
				userCode: $account.value,
				password: $password.value,
				loginType: 1 // 司机端
			}

			app.login(params).then(json => {
				mui(this).button('reset');
				if (json.result) {
					// 如果有记住密码
					if (getState('rememberDate')) {
						setState('userInfo', JSON.stringify(params))
					} else {
						clearState('userInfo')
					}
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

	//记住密码
	rememberPass: () => {
		mui('body').on('tap', '#remember', function () {
			if (!$("#rememberBox").prop("checked")) {
				setState('rememberDate', Date.now())
			} else {
				clearState('rememberDate')
			}
		})
	},

	//进入页面判断是否有本地登录信息
	isLocalLogin: () => {
		// 如果有记住密码
		if (getState('userInfo')) {
			const userInfo = JSON.parse(getState('userInfo'))
			$('#rememberBox').prop('checked', true)
			$('#account').val(userInfo.userCode)
			$('#password').val(userInfo.password)
		} else {
			$('#account').val('')
			$('#password').val('')
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

	// task.splashclosedEvent()
	task.isLocalLogin()

	// 登录时间
	task.login()

	task.rememberPass()
});


task.isLocalLogin()