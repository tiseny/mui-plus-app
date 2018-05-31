import '../libs/fastclick';
import { watchLocation, isLogin, goLogin } from './util';
import { setState, getState, clearState } from './state';

Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "";
	thousand = thousand || ",";
	decimal = decimal || ".";
	let number = this,
		negative = number < 0 ? "-" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

const mui = require('../libs/mui.min.js');

function middleware() {

	// 重新定义 
	mui._ready = func => {

		let readyFunc = mui.os.plus ? mui.plusReady : mui.ready

		readyFunc(() => {

			// 回调
			func();

			// 判断是否已经登录
			isLogin(mui);

			//从后台切换到前台开始定位。
			// document.addEventListener("resume", resetLocal, false);
			document.addEventListener("resume", getLocal, false);

			//获取上传位置
			getLocal()

			//第一次进入首先上传一次位置
			watchLocation(mui);

		})
	}

	//重置本地存储
	function resetLocal() {
		//进入应用时的第一个页面
		clearState('login_url')
		//上次定位时间
		clearState('locationTime')
	}

	//定时获取定位信息
	function getLocal() {
		let localInterval = null
		// 定位信息，未登录、切换到后台、退出应用不定位。
		let clearInter = function () {
			clearInterval(localInterval)
			clearState("login_url");
		}

		localInterval = setInterval(function () {
			watchLocation(mui);
			if (!getState('token')) {
				clearInter()
			} else {
				document.addEventListener("pause", clearInter, false);
			}
		}, 300000)
	}

	mui._toast = msg => {
		if (mui.os.plus) {
			plus.nativeUI.toast(msg)
		} else {
			mui.toast(msg)
		}
	}

	mui._openWindow = params => {
		let conifg = {
			styles: {
				top: '44px',					//新页面顶部位置
				bottom: '50px'				//新页面底部位置
			},
			extras: {
				//自定义扩展参数，可以用来处理页面间传值
			},
			createNew: false,				//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			waiting: {
				autoShow: true,				//自动显示等待框，默认为true
			}
		}
		Object.assign(conifg, params)
		mui.openWindow(conifg)
	}

	return mui
}

export default middleware()